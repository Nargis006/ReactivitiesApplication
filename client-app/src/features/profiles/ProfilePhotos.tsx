import { observer } from "mobx-react-lite";
import react, { SyntheticEvent, useState } from "react";
import { Button, Card, Grid, Header, Image, Tab } from "semantic-ui-react";
import PhotoUploadWidget from "../../app/api/common/ImageUpload/PhptoUploadWidget";
import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";

interface Props {
  profile: Profile;
}
export default observer(function ProfilePhotos({ profile }: Props) {
  const {
    profileStore: {
      isCurrentuser,
      uploadPhoto,
      uploading,
      setMainPhoto,
      loading,
      deletePhoto
    },
  } = useStore();
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState("");

  function handleSetMainPhoto(
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) {
    setTarget(e.currentTarget.name);
    
    setMainPhoto(photo);
  }
  function handlePhotoUpload(file: Blob) {
    uploadPhoto(file).then(() => {
      setAddPhotoMode(false);
    });
  }

  function handleDeletePhoto(
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) {
    setTarget(e.currentTarget.name);
    deletePhoto(photo)
  }
  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header icon="image" content="Photos" />
          {isCurrentuser && (
            <Button
              floated="right"
              basic
              content={addPhotoMode ? "Cancel" : "Add Photo"}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              uploadPhoto={handlePhotoUpload}
              loading={uploading}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile.photos?.map((photo) => (
                <Card key={photo.id}>
                  <Image src={photo.url || "/assets/user.png"} />
                  {isCurrentuser && (
                    <Button.Group>
                      <Button
                        basic
                        color="green"
                        name={'main'+ photo.id}
                        content="Main"
                        disabled={photo.isMain}
                        onClick={e => handleSetMainPhoto(photo, e)}
                        loading={target == 'main'+photo.id && loading}
                      />
                      <Button basic color="red" icon="trash" 
                        onClick={(e)=>handleDeletePhoto(photo,e)}
                        loading={target == photo.id && loading}
                        disabled={photo.isMain}
                        name={photo.id}/>
                    </Button.Group>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
