import { Edit2, Trash2, Eye } from 'lucide-react';
import styles from './DataTable.module.css';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (id: number) => void;
  onView?: (item: any) => void;
  isLoading?: boolean;
  t: (key: string) => string;
  selectable?: boolean;
  selectedIds?: number[];
  onSelectionChange?: (ids: number[]) => void;
}

export default function DataTable({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onView, 
  isLoading, 
  t,
  selectable = false,
  selectedIds = [],
  onSelectionChange
}: DataTableProps) {
  if (isLoading) {
    return <div className={styles.loading}>Loading data...</div>;
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelectionChange) {
      if (e.target.checked) {
        onSelectionChange(data.map(item => item.id));
      } else {
        onSelectionChange([]);
      }
    }
  };

  const handleSelectOne = (id: number) => {
    if (onSelectionChange) {
      if (selectedIds.includes(id)) {
        onSelectionChange(selectedIds.filter(sid => sid !== id));
      } else {
        onSelectionChange([...selectedIds, id]);
      }
    }
  };

  return (
    <div className={`glass ${styles.container}`}>
      <table className={styles.table}>
        <thead>
          <tr>
            {selectable && (
              <th className={styles.checkboxCol}>
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll}
                  checked={data.length > 0 && selectedIds.length === data.length}
                />
              </th>
            )}
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {(onView || onEdit || onDelete) && <th className={styles.actionsHeader}>{t('action')}</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 2 : 1)} className={styles.empty}>
                No data available
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr 
                key={item.id || idx} 
                className={`${styles.row} animate-fade-in ${selectedIds.includes(item.id) ? styles.selectedRow : ''}`} 
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {selectable && (
                  <td className={styles.checkboxCol}>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelectOne(item.id)}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                  </td>
                ))}
                {(onView || onEdit || onDelete) && (
                  <td className={styles.actions}>
                    {onView && (
                      <button onClick={() => onView(item)} className={styles.viewBtn}>
                        <Eye size={16} />
                      </button>
                    )}
                    {onEdit && (
                      <button onClick={() => onEdit(item)} className={styles.editBtn}>
                        <Edit2 size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(item.id)} className={styles.deleteBtn}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
