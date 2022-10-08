import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { format } from "date-fns";

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
      (a, b) => a.date!.getTime() - b.date!.getTime());
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, 'dd MMM yyyy h:mm aa');
        activities[date] = activities[date] ? [...activities[date], activity]
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
    this.activitiesRegistery.set(activity.id, activity);
  };

  private setLodingInitial = (isloading: boolean) => {
    this.loadingInitial = isloading;
  };

  updateActivity = async (activity: Activity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activitiesRegistery.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.submitting = false;
      });
    }
  };
  createActivity = async (activity: Activity) => {
    try {
      this.submitting = true;
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activitiesRegistery.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.submitting = false;
      });
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
}
