import { useReducer, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { tasksReducer } from './tasksReducer.js';
import { AddTaskForm } from './components/AddTaskForm.jsx';
import { TaskList } from './components/TaskList.jsx';
import { useTheme } from './ThemeContext.jsx';
import { ThemeToggle } from './components/ThemeToggle.jsx';
import { useLanguage } from './LanguageContext.jsx';
import { LanguageToggle } from './components/LanguageToggle.jsx';

export default function App() {
  const { theme } = useTheme();
  const { tr } = useLanguage();
  const [tasks, dispatch] = useReducer(tasksReducer, []);

  const handleAdd = useCallback((text) => {
    dispatch({ type: 'add', task: { id: Date.now(), text, done: false } });
  }, []);
  const handleToggle = useCallback((id) => dispatch({ type: 'toggle', id }), []);
  const handleRemove = useCallback((id) => dispatch({ type: 'remove', id }), []);
  const handleRename = useCallback((id, text) => dispatch({ type: 'rename', id, text }), []);

  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);
  useEffect(() => {
    function onKeyDown(e) {
      const tag = document.activeElement.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        searchRef.current.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const visibleTasks = useMemo(() => {
    let list = tasks;
    if (filter === 'done') list = list.filter((t) => t.done);
    if (filter === 'active') list = list.filter((t) => !t.done);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((t) => t.text.toLowerCase().includes(q));
    return list;
  }, [tasks, filter, query]);

  const doneCount = useMemo(() => tasks.filter((t) => t.done).length, [tasks]);

  const donePercent = useMemo(
    () => (tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100)),
    [doneCount, tasks.length]
  );

  return (
    <div className={'app ' + theme}>
      <div className="card">
        <header className="top">
          <h1>{tr.title}</h1>
          <div className="top-buttons">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <AddTaskForm onAdd={handleAdd} />
        <input
          ref={searchRef}
          type="text"
          className="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tr.search}
        />
        <div className="tabs">
          {[['all', tr.all], ['active', tr.active], ['done', tr.done]].map(([key, label]) => (
            <button key={key} className={filter === key ? 'active' : ''} onClick={() => setFilter(key)}>
              {label}
            </button>
          ))}
        </div>
        <p className="muted">
          {tr.total}: {tasks.length}, {tr.doneLabel}: {doneCount} ({donePercent}%)
        </p>
        <TaskList tasks={visibleTasks} onToggle={handleToggle} onRemove={handleRemove} onRename={handleRename} />
      </div>
    </div>
  );
}
