import { useState } from "react"
import DirectoriesTable from "./DirectoriesTable"

export const StartScreen = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const [notifyScreenOpen, setNotifyScreenOpen] = useState(true)
    return (
        <div>
            <p>Start Screen </p>

            <button>Start Watcher</button>
            {notifyScreenOpen &&
                <button>Show Notifications</button>}
            <button>Add directory</button>
            <div><DirectoriesTable /> </div>
        </div>

    )
}