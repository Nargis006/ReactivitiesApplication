import { makeAutoObservable, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";

export default class ActivityStore {
  activitiesRegistery = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loadingInitial = false;
  submitting = false;

  constructor() {
    makeAutoObservable(this);
  }

  //computed properties
  get activitiesByDate() {
    return Array.from(this.activitiesRegistery.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, "dd MMM yyyy h:mm aa");
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  loadActivities = async () => {
    try {
      this.loadingInitial = true;
      const activities = await agent.Activities.list();
      activities.forEach((activity) => {
        this.setActivity(activity);
      });
      this.setLodingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLodingInitial(false);
    }
  };

  loadActivity = async (id: string) => {
    this.setLodingInitial(true);
    let activity = this.getActivity(id);
    if (activity) {
      this.setSelectedActivity(activity);
      this.setLodingInitial(false);
      return activity;
    } else {
      try {
        const activity = await agent.Activities.details(id);
        this.setActivity(activity);
        this.setSelectedActivity(activity);
        this.setLodingInitial(false);
        return activity;
      } catch (error) {
        console.log(error);
        this.setLodingInitial(false);
      }
    }
  };

  private getActivity = (id: string) => {
    return this.activitiesRegistery.get(id);
  };

  private setSelectedActivity = (activity: Activity) => {
    this.selectedActivity = activity;
  };

  private setActivity = (activity: Activity) => {
    activity.date = new Date(activity.date!);
    const user = store.userStore.user;
    if (user) {
      activity.isGoing = activity.attendees!.some(
        (a) => a.userName == user.userName
      );
      activity.isHost = activity.hostName == user.userName;
      activity.host = activity.attendees?.find(
        (x) => x.userName == activity.hostName
      );
    }
    this.activitiesRegistery.set(activity.id, activity);
  };

  private setLodingInitial = (isloading: boolean) => {
    this.loadingInitial = isloading;
  };

  updateActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        if(activity.id){
          let updatedActivity = {...this.getActivity(activity.id), ...activity};
          this.activitiesRegistery.set(activity.id, updatedActivity as Activity);
          this.selectedActivity = updatedActivity as Activity;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!)
    try {
      await agent.Activities.create(activity);
      const newActivity = new Activity(activity);
      newActivity.hostName = user?.userName!;
      newActivity.attendees = [attendee];
      this.setActivity(newActivity);
      runInAction(() => {
        this.selectedActivity = newActivity;
      });
    } catch (error) {
      console.log(error);
    }
  };

  deleteActivity = async (id: string) => {
    this.submitting = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activitiesRegistery.delete(id);
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.submitting = false;
      });
    }
  };

  updateAttendance = async ()=>{
    const user = store.userStore.user;
    this.submitting = true;
    try{
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(()=>{
        if(this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a=>a.userName !=user?.userName);
          this.selectedActivity.isGoing = false;
        }
        else {
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
        }
        this.activitiesRegistery.set(this.selectedActivity!.id, this.selectedActivity!);
      })
    }
    catch(err){
      console.log(err);
    } finally{
      runInAction(()=>this.submitting = false);
    }
  }

  cancelActivityToggle = async () =>{
    this.submitting = true;
    try{
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(()=>{
        this.selectedActivity!.isCancelled = !this.selectedActivity!.isCancelled;
        this.activitiesRegistery.set(this.selectedActivity!.id, this.selectedActivity!)
      })
    }catch(error){
      console.log(error);
    }
    finally{
      runInAction(()=> this.submitting = false)
    }
  }
}
