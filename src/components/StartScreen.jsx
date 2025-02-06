import { useState } from "react"
import DirectoriesTable from "./DirectoriesTable"
import AddEditModal from "./AddEditModal"
import ConfigSelector from "./ConfigSelector"

export const StartScreen = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const [notifyScreenOpen, setNotifyScreenOpen] = useState(false)
   
    const onModalClose = () => {
        setModalOpen(false);
      };
   
    return (
        <div>
            <p>Start Screen </p>
            <div>
                <ConfigSelector />
            </div>

            <button className="primary"> Start Watcher</button>
            {!notifyScreenOpen &&
                <button>Show Notifications</button>}
            <button onClick ={ () => setModalOpen(true)}>Add directory</button>
            {modalOpen && <AddEditModal
            onModalClose={onModalClose} />}
            {/* <div><DirectoriesTable /> </div> */}
        </div>

    )
}