import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MarketNavbar from "./MarketNavbar";
import BottomNav from "./BottomNav";

import ulkerLogo from "../assets/brands/ulker.jpg";
import pepsiLogo from "../assets/brands/pepsi.jpg";
import cocacolaLogo from "../assets/brands/cocacola.jpg";
import etiLogo from "../assets/brands/eti.jpg";
import laysLogo from "../assets/brands/lays.jpg";
import kalasherLogo from "../assets/brands/kalasher.jpg";
import alenLogo from "../assets/brands/alen.jpg";
import sadiaLogo from "../assets/brands/sadia.jpg";
import mLogo from "../assets/brands/m.jpg";
import altunsaLogo from "../assets/brands/altunsa.jpg";
import tekSutLogo from "../assets/brands/tek-sut.jpg";
import henanLogo from "../assets/brands/henan.jpg";
import almaraiLogo from "../assets/brands/almarai.jpg";
import nawrasLogo from "../assets/brands/nawras.jpg";
import kiriLogo from "../assets/brands/kiri.jpg";
import duruLogo from "../assets/brands/duru.jpg";
import oreoLogo from "../assets/brands/oreo.jpg";
import freezMixLogo from "../assets/brands/freez-mix.jpg";
import headShouldersLogo from "../assets/brands/head-shoulders.jpg";
import nutellaLogo from "../assets/brands/nutella.jpg";

function BrandsPage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Brands | Kozan Market";
  }, []);

  const allBrands = [
  { name: "Ulker", logo: ulkerLogo },
  { name: "Pepsi", logo: pepsiLogo },
  { name: "Coca Cola", logo: cocacolaLogo },
  { name: "ETi", logo: etiLogo },
  { name: "Lays", logo: laysLogo },
  { name: "Kalasher", logo: kalasherLogo },
  { name: "Alen", logo: alenLogo },
  { name: "Sadia", logo: sadiaLogo },
  { name: "Mahmood", logo: mLogo },
  { name: "Altunsa", logo: altunsaLogo },

  { name: "Tek Sut", logo: tekSutLogo },
  { name: "Henan", logo: henanLogo },
  { name: "Almarai", logo: almaraiLogo },
  { name: "Nawras", logo: nawrasLogo },
  { name: "Kiri", logo: kiriLogo },
  { name: "Duru", logo: duruLogo },
  { name: "Oreo", logo: oreoLogo },
  { name: "Freez Mix", logo: freezMixLogo },
  { name: "Head & Shoulders", logo: headShouldersLogo },
  { name: "Nutella", logo: nutellaLogo },
];

  const filteredBrands = useMemo(() => {
    return allBrands.filter((brand) =>
      brand.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #eef7ff 0%, #f8fafc 45%, #f8fafc 100%)",
        paddingBottom: "110px",
      }}
    >
      <MarketNavbar />

      <div style={{ maxWidth: "1220px", margin: "0 auto", padding: "20px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #0f766e, #2563eb)",
            borderRadius: "30px",
            padding: "30px",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
            boxShadow: "0 18px 40px rgba(37, 99, 235, 0.18)",
            marginBottom: "22px",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 8px 0",
                opacity: 0.9,
                fontSize: "13px",
                fontWeight: "800",
                letterSpacing: "1px",
              }}
            >
              SHOP BY BRAND
            </p>

            <h1
              style={{
                margin: "0 0 8px 0",
                fontSize: "40px",
                lineHeight: 1.12,
                fontWeight: "900",
              }}
            >
              Brands
            </h1>

            <p
              style={{
                margin: 0,
                opacity: 0.95,
                lineHeight: 1.7,
                maxWidth: "620px",
              }}
            >
              Browse all available brands and open each one to see its products.
            </p>
          </div>

          <button
            onClick={() => navigate("/market")}
            style={{
              padding: "14px 18px",
              borderRadius: "14px",
              border: "none",
              background: "white",
              color: "#0f172a",
              fontWeight: "800",
              cursor: "pointer",
            }}
          >
            Back to Market
          </button>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "20px",
            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
            border: "1px solid #eef2f7",
            marginBottom: "22px",
          }}
        >
          <input
            type="text"
            placeholder="Search brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "14px",
              border: "1px solid #dbe4ee",
              outline: "none",
              fontSize: "15px",
              background: "white",
              boxSizing: "border-box",
            }}
          />
        </div>

        {filteredBrands.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "40px",
              textAlign: "center",
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
              border: "1px solid #eef2f7",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#0f172a", fontSize: "24px" }}>
              No brands found
            </h3>
            <p style={{ color: "#64748b", marginBottom: 0 }}>
              Try another search word.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            {filteredBrands.map((brand, index) => (
              <button
                key={index}
                onClick={() =>
                  navigate(`/brands/${encodeURIComponent(brand.name)}`)
                }
                style={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "24px",
                  padding: "16px",
                  cursor: "pointer",
                  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
                  minHeight: "180px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "120px",
                    borderRadius: "18px",
                    overflow: "hidden",
                    background: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #eef2f7",
                  }}
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "900",
                      color: "#0f172a",
                      marginBottom: "6px",
                      wordBreak: "break-word",
                    }}
                  >
                    {brand.name}
                  </div>

                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      fontWeight: "700",
                    }}
                  >
                    View products
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default BrandsPage;