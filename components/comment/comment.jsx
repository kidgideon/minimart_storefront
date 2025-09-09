// components/comment/Comments.js
import Image from "next/image";
import styles from "./comment.module.css";

import woman1 from "../../public/images/woman1.jpg";
import woman2 from "../../public/images/woman2.jpg";
import woman3 from "../../public/images/woman3.jpg";
import woman4 from "../../public/images/woman4.jpg";
import woman5 from "../../public/images/woman5.jpg";
import woman6 from "../../public/images/woman6.jpg";
import woman7 from "../../public/images/woman7.jpg";

const Comments = () => {
  const comments = [
    {
      main: "It took me less than an hour to set up my store.",
      detail:
        "I’m not even a tech person, but Minimart made it so simple. I now have a professional online store that works 24/7 without stress.",
      author: "Aisha Bello",
      img: woman2,
    },
    {
      main: "My sales have doubled since joining Minimart.",
      detail:
        "I sell skincare products, and sharing my store link has made ordering very easy for customers. No more endless WhatsApp messages.",
      author: "Mary Johnson",
      img: woman3,
    },
    {
      main: "Getting paid upfront changed everything for me.",
      detail:
        "Before Minimart, I used to beg customers to send payment. Now they pay instantly before I ship anything, and I no longer lose money on unserious buyers.",
      author: "Hannah Chisom",
      img: woman1,
    },
    {
      main: "Delivery is no longer a headache.",
      detail:
        "Now my delivery options are clearly shown, and customers just select what they want at checkout. It’s more organized and saves me time.",
      author: "Grace Umeh",
      img: woman4,
    },
    {
      main: "I finally look professional online.",
      detail:
        "Customers now trust me because my store looks legit with prices, policies, and receipts. Before Minimart, people used to doubt my business.",
      author: "Chinwe Okafor",
      img: woman5,
    },
    {
      main: "Minimart helped me sell both products and services together.",
      detail:
        "As a makeup artist, I now book appointments and sell my products in one place. No need for multiple platforms.",
      author: "Fadekemi Lawal",
      img: woman6,
    },
    {
      main: "I didn’t have to pay anything to start.",
      detail:
        "That was my biggest fear. Minimart only takes a cut when I make a sale. It’s perfect for small business owners like me.",
      author: "Ngozi Adeniran",
      img: woman7,
    },
  ];

  return (
    <section className={styles.interface} aria-label="Customer Testimonials">
      <h2 className={styles.commentsTitle}>
        What Business Owners Say About Minimart
      </h2>

      <div className={styles.commentsArea}>
        {comments.map((c, index) => (
          <article className={styles.comment} key={index} itemScope itemType="https://schema.org/Review">
            <blockquote className={styles.mainComment} itemProp="reviewBody">
              {c.main}
            </blockquote>
            <p className={styles.explanationComment}>{c.detail}</p>
            <div className={styles.commenterProfile}>
              {c.img && (
                <Image
                  src={c.img}
                  alt={`Photo of ${c.author} sharing her Minimart experience`}
                  width={60}
                  height={60}
                  className={styles.commenterImage}
                />
              )}
              <span itemProp="author" itemScope itemType="https://schema.org/Person">
                <span itemProp="name">{c.author}</span>
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Comments;
