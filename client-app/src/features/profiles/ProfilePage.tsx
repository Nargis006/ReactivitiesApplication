import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/loadingComponent";
import { useStore } from "../../app/stores/store";
import ProfileContent from "./ProfileContent";
import ProfileHeader from "./ProfileHeader";

export default observer(function ProfilePhoto(){
    const {username} = useParams<{username:string}>();
    const {profileStore} = useStore();
    const {loadProfile, loadingprofile, profile } = profileStore;

    useEffect(()=>{
        loadProfile(username);
    },[loadProfile, username]);
    if(loadingprofile) <LoadingComponent content="Loading content"/>
    return (<Grid>
        <Grid.Column width={16}>
            {profile && <ProfileHeader profile={profile}/>}
            {profile && <ProfileContent profile={profile}/>}
        </Grid.Column>
    </Grid>)
})