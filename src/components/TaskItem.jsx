import { memo } from 'react';

export const TaskItem = memo(function TaskItem({ task, onToggle, onRemove, onRename }) {
  console.log('Рисуем задачу:', task.text);

  function handleEdit() {
    const newText = prompt('Новый текст задачи', task.text);
    if (newText && newText.trim()) onRename(task.id, newText.trim());
  }

  return (
    <li className={task.done ? 'done' : ''}>
      <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />
      <span>{task.text}</span>
      <button onClick={handleEdit}>Редактирование</button>
      <button onClick={() => onRemove(task.id)}>×</button>
    </li>
  );
});
