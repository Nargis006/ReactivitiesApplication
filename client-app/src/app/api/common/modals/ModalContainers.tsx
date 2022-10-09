import { observer } from "mobx-react-lite";
import { Modal } from "semantic-ui-react";
import { useStore } from "../../../stores/store";

export default observer(function ModelContainer() {
  const { modalStore } = useStore();
  return (
    <>
      <Modal
        open={modalStore.model.open}
        onClose={() => modalStore.closeModel}
        size="mini"
      >
        <Modal.Content>{modalStore.model.body}</Modal.Content>
      </Modal>
    </>
  );
});
