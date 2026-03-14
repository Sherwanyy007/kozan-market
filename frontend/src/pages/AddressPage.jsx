import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MarketNavbar from "./MarketNavbar";
import BottomNav from "./BottomNav";

function AddressPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Erbil");
  const [addressType, setAddressType] = useState("");
  const [street, setStreet] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [additionalDirections, setAdditionalDirections] = useState("");
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.title = "Address | Kozan Market";

    const savedAddress = JSON.parse(localStorage.getItem("savedAddress"));
    if (savedAddress) {
      setName(savedAddress.name || "");
      setPhone(savedAddress.phone || "");
      setCity(savedAddress.city || "Erbil");
      setAddressType(savedAddress.addressType || "");
      setStreet(savedAddress.street || "");
      setBuildingName(savedAddress.buildingName || "");
      setApartmentNumber(savedAddress.apartmentNumber || "");
      setFloor(savedAddress.floor || "");
      setAddressDetails(savedAddress.addressDetails || "");
      setAdditionalDirections(savedAddress.additionalDirections || "");
      setGoogleMapsLink(savedAddress.googleMapsLink || "");
      setLat(savedAddress.lat ?? "");
      setLng(savedAddress.lng ?? "");
    }
  }, []);

  const fullAddressPreview = useMemo(() => {
    const parts = [
      city,
      addressType,
      street,
      buildingName,
      apartmentNumber ? `Apt ${apartmentNumber}` : "",
      floor ? `Floor ${floor}` : "",
      addressDetails,
      additionalDirections,
    ].filter(Boolean);

    return parts.join(" • ");
  }, [
    city,
    addressType,
    street,
    buildingName,
    apartmentNumber,
    floor,
    addressDetails,
    additionalDirections,
  ]);

  const saveAddress = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter your phone number");
      return;
    }

    if (!city.trim()) {
      alert("Please enter your city");
      return;
    }

    if (!street.trim() && !addressDetails.trim()) {
      alert("Please enter at least street or address details");
      return;
    }

    const addressData = {
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      addressType: addressType.trim(),
      street: street.trim(),
      buildingName: buildingName.trim(),
      apartmentNumber: apartmentNumber.trim(),
      floor: floor.trim(),
      addressDetails: addressDetails.trim(),
      additionalDirections: additionalDirections.trim(),
      googleMapsLink: googleMapsLink.trim(),
      lat: lat === "" ? null : Number(lat),
      lng: lng === "" ? null : Number(lng),
    };

    localStorage.setItem("savedAddress", JSON.stringify(addressData));
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const clearAddress = () => {
    const ok = window.confirm("Are you sure you want to clear saved address?");
    if (!ok) return;

    localStorage.removeItem("savedAddress");

    setName("");
    setPhone("");
    setCity("Erbil");
    setAddressType("");
    setStreet("");
    setBuildingName("");
    setApartmentNumber("");
    setFloor("");
    setAddressDetails("");
    setAdditionalDirections("");
    setGoogleMapsLink("");
    setLat("");
    setLng("");
    setSaved(false);
  };

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
              DELIVERY DETAILS
            </p>
            <h1
              style={{
                margin: "0 0 8px 0",
                fontSize: "40px",
                lineHeight: 1.12,
                fontWeight: "900",
              }}
            >
              Saved Address
            </h1>
            <p
              style={{
                margin: 0,
                opacity: 0.95,
                lineHeight: 1.7,
                maxWidth: "620px",
              }}
            >
              Save your delivery information once so checkout becomes faster,
              easier, and more accurate for every future order.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/market")} style={heroWhiteButtonStyle}>
              Back to Market
            </button>
            <button onClick={() => navigate("/my-orders")} style={heroOutlineButtonStyle}>
              My Orders
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "20px",
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "26px",
              padding: "22px",
              boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
              border: "1px solid #eef2f7",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "18px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    color: "#0f172a",
                    fontSize: "28px",
                    fontWeight: "900",
                  }}
                >
                  Address Form
                </h2>
                <p style={{ margin: "6px 0 0 0", color: "#64748b" }}>
                  Fill in your delivery details carefully
                </p>
              </div>

              {saved && (
                <div
                  style={{
                    background: "#dcfce7",
                    color: "#166534",
                    padding: "10px 14px",
                    borderRadius: "999px",
                    fontSize: "13px",
                    fontWeight: "800",
                  }}
                >
                  Address saved successfully
                </div>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "12px",
              }}
            >
              <input
                style={inputStyle}
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                style={inputStyle}
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <input
                style={inputStyle}
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <select
                style={inputStyle}
                value={addressType}
                onChange={(e) => setAddressType(e.target.value)}
              >
                <option value="">Address Type</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Office">Office</option>
                <option value="Shop">Shop</option>
              </select>

              <input
                style={inputStyle}
                placeholder="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />

              <input
                style={inputStyle}
                placeholder="Building Name"
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
              />

              <input
                style={inputStyle}
                placeholder="Apartment Number"
                value={apartmentNumber}
                onChange={(e) => setApartmentNumber(e.target.value)}
              />

              <input
                style={inputStyle}
                placeholder="Floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              />

              <input
                style={wideInputStyle}
                placeholder="Address Details"
                value={addressDetails}
                onChange={(e) => setAddressDetails(e.target.value)}
              />

              <input
                style={wideInputStyle}
                placeholder="Additional Directions"
                value={additionalDirections}
                onChange={(e) => setAdditionalDirections(e.target.value)}
              />

              <input
                style={wideInputStyle}
                placeholder="Google Maps Link"
                value={googleMapsLink}
                onChange={(e) => setGoogleMapsLink(e.target.value)}
              />

              <input
                style={inputStyle}
                placeholder="Latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />

              <input
                style={inputStyle}
                placeholder="Longitude"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "18px",
              }}
            >
              <button onClick={saveAddress} style={primaryButtonStyle}>
                Save Address
              </button>

              <button onClick={clearAddress} style={dangerButtonStyle}>
                Clear Saved Address
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "20px",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "26px",
                padding: "22px",
                boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
                border: "1px solid #eef2f7",
              }}
            >
              <h2
                style={{
                  margin: "0 0 16px 0",
                  color: "#0f172a",
                  fontSize: "28px",
                  fontWeight: "900",
                }}
              >
                Address Preview
              </h2>

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={infoCardStyle}>
                  <p style={infoLabelStyle}>Name</p>
                  <strong>{name || "-"}</strong>
                </div>

                <div style={infoCardStyle}>
                  <p style={infoLabelStyle}>Phone</p>
                  <strong>{phone || "-"}</strong>
                </div>

                <div style={infoCardStyle}>
                  <p style={infoLabelStyle}>City</p>
                  <strong>{city || "-"}</strong>
                </div>

                <div style={infoCardStyle}>
                  <p style={infoLabelStyle}>Full Address</p>
                  <strong>{fullAddressPreview || "-"}</strong>
                </div>

                <div style={infoCardStyle}>
                  <p style={infoLabelStyle}>Google Maps</p>
                  <strong>{googleMapsLink || "-"}</strong>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: "26px",
                padding: "22px",
                boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
                border: "1px solid #eef2f7",
              }}
            >
              <h2
                style={{
                  margin: "0 0 16px 0",
                  color: "#0f172a",
                  fontSize: "26px",
                  fontWeight: "900",
                }}
              >
                Quick Tips
              </h2>

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={tipCardStyle}>
                  Use the same phone number you use when placing orders.
                </div>
                <div style={tipCardStyle}>
                  Add street, building, and apartment details for faster delivery.
                </div>
                <div style={tipCardStyle}>
                  A Google Maps link helps delivery become more accurate.
                </div>
              </div>

              <div style={{ marginTop: "18px", display: "grid", gap: "10px" }}>
                <button
                  onClick={() => navigate("/market")}
                  style={secondaryWideButtonStyle}
                >
                  Go to Market
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  style={primaryWideButtonStyle}
                >
                  Go to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #dbe4ee",
  outline: "none",
  fontSize: "15px",
  background: "white",
  boxSizing: "border-box",
};

const wideInputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #dbe4ee",
  outline: "none",
  fontSize: "15px",
  background: "white",
  boxSizing: "border-box",
  gridColumn: "span 2",
};

const primaryButtonStyle = {
  padding: "14px 18px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg,#14b8a6,#2563eb)",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(37,99,235,0.16)",
};

const dangerButtonStyle = {
  padding: "14px 18px",
  borderRadius: "14px",
  border: "none",
  background: "#ef4444",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
};

const heroWhiteButtonStyle = {
  padding: "14px 18px",
  borderRadius: "14px",
  border: "none",
  background: "white",
  color: "#0f172a",
  fontWeight: "800",
  cursor: "pointer",
};

const heroOutlineButtonStyle = {
  padding: "14px 18px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.35)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
};

const infoCardStyle = {
  background: "#f8fafc",
  borderRadius: "16px",
  padding: "14px",
};

const infoLabelStyle = {
  margin: "0 0 6px 0",
  color: "#64748b",
  fontSize: "13px",
};

const tipCardStyle = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "14px",
  color: "#334155",
  lineHeight: "1.7",
  fontWeight: "600",
};

const secondaryWideButtonStyle = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: "14px",
  border: "1px solid #dbe4ee",
  background: "white",
  color: "#0f172a",
  fontWeight: "800",
  cursor: "pointer",
};

const primaryWideButtonStyle = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg,#14b8a6,#2563eb)",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(37,99,235,0.16)",
};

export default AddressPage;