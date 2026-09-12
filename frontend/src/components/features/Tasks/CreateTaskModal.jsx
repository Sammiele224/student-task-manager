import { Modal } from '../../ui/Modal'
import { TaskForm } from './BodyTaskForm'

const EMPTY_VALUES = {
    title: '',
    courseId: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo',
    description: '',
}

export function CreateTaskModal({
    open,
    onClose,
    courses = [],
    onCreate,
}) {
    const handleSubmit = async (values) => {
        await onCreate(values)
        onClose()
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            eyebrow="Your academic world"
            title="A new task starts here."
            subtitle="Break your plans into small, meaningful steps."
        >
            <TaskForm
                initialValues={EMPTY_VALUES}
                courses={courses}
                submitLabel="Create task"
                showStatus={false}
                onCancel={onClose}
                onSubmit={handleSubmit}
            />
        </Modal>
    )
}