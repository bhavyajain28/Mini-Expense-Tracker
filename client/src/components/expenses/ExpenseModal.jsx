import Modal from '../shared/Modal';
import ExpenseForm from './ExpenseForm';
import { toInputDate } from '../../utils/date';

export default function ExpenseModal({ isOpen, onClose, onSubmit, expense }) {
  const isEditing = !!expense;

  const initialValues = expense
    ? {
        amount: String(expense.amount),
        category: expense.category,
        date: toInputDate(expense.date),
        note: expense.note || '',
      }
    : undefined;

  const handleSubmit = async (data) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Expense' : 'Add Expense'}
    >
      <ExpenseForm
        onSubmit={handleSubmit}
        onCancel={onClose}
        initialValues={initialValues}
        submitLabel={isEditing ? 'Update Expense' : 'Add Expense'}
      />
    </Modal>
  );
}
