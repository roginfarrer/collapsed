import Image from "next/image";
import styles from "./page.module.css";
import { Collapse } from "./Collapse";

export default function Home() {
  return (
    <main className={styles.main}>
      <Collapse />
    </main>
  );
}
