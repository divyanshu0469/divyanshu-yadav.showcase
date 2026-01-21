import AnimatedRedLines from "@/components/1ffect/AnimatedRedLines";
import AnimatedHeader from "@/components/1ffect/AnimatedHeader";
import styles from "./1ffect.module.css";
import ToolBar from "@/components/common/ToolBar";

export default function Effect1() {
  return (
    <div className={styles.container}>
      <AnimatedRedLines className={styles.redLines} />
      <AnimatedHeader />
      <ToolBar
        foreground="var(--foreground)"
        position={{ bottom: "2rem", right: "2rem" }}
      />
    </div>
  );
}
