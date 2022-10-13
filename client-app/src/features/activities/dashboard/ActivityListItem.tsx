import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface Props {
  activity: Activity;
}
export default function ActivityListItem({ activity }: Props) {
  return (
    <>
      <Segment.Group>
        <Segment>
          {activity.isCancelled && (
            <Label
              attached="top"
              color="red"
              content="Cancelled"
              style={{ textAlign: "center" }}     
            ></Label>
          )}
          <Item.Group>
            <Item>
              <Item.Image size="tiny" src={activity.host?.image || '/assets/user.png'} circular  style={{marginBottom: 3}}/>
              <Item.Content>
                <Item.Header as={Link} to={`/activities/${activity.id}`}>
                  {activity.title}
                </Item.Header>
                <Item.Description>
                  Hosted By <Link to={`/profiles/${activity.hostName}`}>{activity.host?.displayName}</Link>
                </Item.Description>
                {activity.isHost && (
                  <Item.Description>
                    <Label color="orange">You are hosting this activity</Label>
                  </Item.Description>
                )}
                {activity.isGoing && !activity.isHost && (
                  <Item.Description>
                    <Label color="green">You are going to this activity</Label>
                  </Item.Description>
                )}
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment>
          <span>
            <Icon name="clock" />{" "}
            {format(activity.date!, "dd MMM yyyy h:mm aa")}
            <Icon name="marker" /> {activity.venue}
          </span>
        </Segment>
        <Segment secondary>
          <ActivityListItemAttendee attendees={activity.attendees!} />
        </Segment>
        <Segment clearing>
          <span>{activity.description}</span>
          <Button
            as={Link}
            to={`/activities/${activity.id}`}
            color="teal"
            content="view"
            floated="right"
          />
        </Segment>
      </Segment.Group>
    </>
  );
}
