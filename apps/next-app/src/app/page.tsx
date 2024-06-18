import styles from "./page.module.css";
import { ReactCollapsed, CollapsedReact } from "./Collapse";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={`${styles.section} ${styles.first}`}>
        <h2 className={styles.heading}>react-collapsed</h2>
        <ReactCollapsed />
      </div>
      <div className={`${styles.section} ${styles.second}`}>
        <h2 className={styles.heading}>@collapsed/react</h2>
        <CollapsedReact />
      </div>
    </main>
  );
}
