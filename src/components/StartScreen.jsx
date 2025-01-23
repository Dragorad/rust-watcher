import { useState } from "react"
import DirectoriesTable from "./DirectoriesTable"
import AddEditModal from "./AddEditModal"

export const StartScreen = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const [notifyScreenOpen, setNotifyScreenOpen] = useState(false)
   
    const onModalClose = () => {
        setModalOpen(false);
      };
   
    return (
        <div>
            <p>Start Screen </p>

            <button className="primary"> Start Watcher</button>
            {!notifyScreenOpen &&
                <button>Show Notifications</button>}
            <button onClick ={ () => setModalOpen(true)}>Add directory</button>
            {modalOpen && <AddEditModal
            onModalClose={onModalClose} />}
            <div><DirectoriesTable /> </div>
        </div>

    )
}