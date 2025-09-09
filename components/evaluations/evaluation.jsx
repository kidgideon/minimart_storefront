"use client";

import { useRef, useEffect } from "react";
import styles from "./evaluation.module.css";

const evaluationsData = [
  { value: 400, text: "businesses trust Minimart" },
  { value: 600, text: "items sold via our platform" },
  { value: 1500, text: "products listed online" },
  { value: 12000, text: "processed customer orders" }
];

const Evaluations = () => {
  const ref = useRef(null);

  // Optional: if you want to fade it in slightly when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && ref.current) {
          ref.current.style.opacity = 1;
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={styles.evaluationArea}
      ref={ref}
      aria-label="Minimart Growth Statistics"
      style={{ opacity: 0, transition: "opacity 0.6s ease" }} // fade-in if you want
    >
      {evaluationsData.map((item, i) => (
        <div key={i} className={styles.eval}>
          <dt className={styles.value}>{item.value.toLocaleString()}+</dt>
          <dd className={styles.valText}>{item.text}</dd>
        </div>
      ))}
    </section>
  );
};

export default Evaluations;
