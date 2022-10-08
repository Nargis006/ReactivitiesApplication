import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
  activity: Activity;
}
export default function ActivityListItem({ activity }: Props) {
  return (
    <>
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" src="/assets/user.png" circular />
              <Item.Content>
                <Item.Header as={Link} to={`/activities/${activity.id}`}>
                  {activity.title}
                </Item.Header>
                <Item.Description>Hosted By Nargis!</Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment>
          <span>
            <Icon name="clock" /> {format(activity.date!, 'dd MMM yyyy h:mm aa')}
            <Icon name="marker" /> {activity.venue}
          </span>
        </Segment>
        <Segment secondary>Addendies goes here</Segment>
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
