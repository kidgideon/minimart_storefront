"use client";

import { useEffect, useState } from "react";
import styles from "./Services.module.css";
import { db } from "../../lib/firebase"; // Adjusted import path for Next.js convention
import { doc, getDoc } from "firebase/firestore";
import ProductCard from "../productCard/productCard";

const Services = ({ storeId }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch services when storeId changes
  useEffect(() => {
    const fetchServices = async () => {
      if (!storeId) return;
      try {
        const docRef = doc(db, "businesses", storeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const serviceData = docSnap.data().services || [];
          setServices(serviceData);
          setFilteredServices(serviceData);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, [storeId]);

  // Filter services when search or category changes
  useEffect(() => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    setFilteredServices(filtered);
  }, [searchTerm, selectedCategory, services]);

  if (services.length === 0) return null;

  const categories = ["All", ...new Set(services.map(s => s.category).filter(Boolean))];

  return (
    <div className={styles.servicesContainer}>
      <div className={styles.header}>
        <h2>Our Services</h2>

        <div className={styles.filters}>
          <div className={styles.inputGroup}>
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <i className="fas fa-filter"></i>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {filteredServices.map(service => (
          <ProductCard
            key={service.serviceId}
            storeId={storeId}
            item={{ ...service, _ft: "service" }} // Ensures ProductCard handles it properly
          />
        ))}
      </div>
    </div>
  );
};

export default Services;
