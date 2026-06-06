import styles from './Nav.module.css';

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.workspace}>
        <span className={styles.avatar}>A</span>
        <span className={styles.workspaceLabel}>Axler · seller canvas</span>
      </div>

      <span className={styles.logotype}>Axler</span>

      <div className={styles.badge}>
        <span className={styles.dot} />
        <span className={styles.badgeLabel}>Founding seller access</span>
      </div>
    </nav>
  );
}
