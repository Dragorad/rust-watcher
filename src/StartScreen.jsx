import { useState } from "react"
import DirectoriesTable from "./DirectoriesTable"
import AddEditModal from "./AddEditModal"

export const StartScreen = () => {
    const [modalOpen, setModalOpen] = useState(true)
    const [notifyScreenOpen, setNotifyScreenOpen] = useState(true)
    return (
        <div>
            <p>Start Screen </p>

            <button>Start Watcher</button>
            {notifyScreenOpen &&
                <button>Show Notifications</button>}
            <button>Add directory</button>
            {modalOpen && <AddEditModal />}
            <div><DirectoriesTable /> </div>
        </div>

    )
}