import React, { useState, useEffect } from 'react';
import { MapPin, X, Check, Trash, Copy, CheckCircle   } from 'lucide-react';
import styles2 from '../styles/map.module.css'

const LocationPicker = ({ isOpen, onClose, onLocationSelect, initialLocation }) => {
  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null);
  const [marker, setMarker] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [currentaddr, setCurrentaddr] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      if (window.L) {
        initializeMap();
        return;
      }

      // Load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
      document.head.appendChild(link);

      // Load JS
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.onload = () => {
        setTimeout(initializeMap, 100);
      };
      document.head.appendChild(script);
    };

    loadLeaflet();

    return () => {
      if (map) {
        map.remove();
        setMap(null);
        setMarker(null);
      }
    };
  }, [isOpen]);

  const initializeMap = () => {
    // Set initial view - use initialLocation if available, otherwise default to UCI
    const initialView = (initialLocation && initialLocation.lat && initialLocation.lng) 
      ? [initialLocation.lat, initialLocation.lng] 
      : [33.6455, -117.8426];
    
    const mapInstance = window.L.map('map').setView(initialView, 17);
    
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    // Store reference to current marker for this map instance
    let currentMarker = null;

    // Add click handler
    mapInstance.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      
      // Remove existing marker if it exists
      if (currentMarker) {
        mapInstance.removeLayer(currentMarker);
        currentMarker = null;
      }
      
      // Add new marker
      const newMarker = window.L.marker([lat, lng]).addTo(mapInstance);
      currentMarker = newMarker;
      setMarker(newMarker);
      
      // Reverse geocode to get address
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
        const data = await response.json();
        const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setSelectedLocation({ lat, lng, address: address, address2: address });
      } catch (error) {
        console.error('Geocoding failed:', error);
        setSelectedLocation({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, address2: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
      }
    });

    // Add initial marker if location exists
    if (initialLocation && initialLocation.lat && initialLocation.lng) {

      console.log(initialLocation)  
      const initialMarker = window.L.marker([initialLocation.lat, initialLocation.lng]).addTo(mapInstance);
      currentMarker = initialMarker;
      setMarker(initialMarker);
      setSelectedLocation(initialLocation);
    }

    setMap(mapInstance);
  };

  const handleConfirm = (submit) => {
    if (selectedLocation && onLocationSelect) {
      onLocationSelect({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        address: selectedLocation.address || "n/a",
        address2: selectedLocation.address2 || ""
      }, submit);
    }
    if (!submit) {setSelectedLocation(null)}
    onClose();
  };

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState('');
  if (!isOpen) return null;




const handleAddressBlur = () => {
  // Save the edited address
  let addr = editingAddress.trim()
  if (!addr) addr = "n/a" 
  setSelectedLocation(prev => ({
    ...prev,
    address: addr
  }));
  setIsEditingAddress(false);
};

const handleAddressKeyDown = (e) => {
  if (e.key === 'Enter') {
    handleAddressBlur();
  } else if (e.key === 'Escape') {
    // Cancel editing
    setIsEditingAddress(false);
    setEditingAddress('');
  }
};



  return (
  <div className={styles2.overlay}>
    <div className={styles2.modal}>
      <div className={styles2.header}>
        <h2 className={styles2.title}>Select Location</h2>
        <button
        onClick={() => { setSelectedLocation(null); onClose(); }}
        aria-label="Close details"
        className={styles2.closeButton}
        >
            <X className={styles2.icon} size={20} />
        </button>
      </div>


      {selectedLocation && (
        <div className={styles2.currentLocationDisplay}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className={styles2.currentLocationHeader2}>
              Location Name
            </h3>
            <h3
              className={`${styles2.currentLocationHeader} ${isCopied ? styles2.copiedHeader : ''}`}
              onClick={() => {
                if (isCopied && !selectedLocation.address2) return; // Prevent interaction while copied

                try {
                  
                  const address = selectedLocation.address2
                  navigator.clipboard.writeText(address);
                  console.log("Address copied to clipboard:", address);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                } catch (error) {
                  console.error('Failed to copy address:', error);
                  const fallbackAddress = `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`;
                  navigator.clipboard.writeText(fallbackAddress);
                  console.log("Coordinates copied to clipboard:", fallbackAddress);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 3000);
                }
              }}
            >
              {isCopied ? (
                <CheckCircle className={styles2.icon2} size={16} style={{ color: 'green' }} />
              ) : (
                <Copy className={styles2.icon2} size={16} />
              )}
              {isCopied ? ' Copied!' : ' Copy Address'}
            </h3>

            
          </div>
          {isEditingAddress ? (
            <input
              type="text"
              value={editingAddress}
              onChange={(e) => setEditingAddress(e.target.value)}
              onBlur={handleAddressBlur}
              onKeyDown={handleAddressKeyDown}
              className={styles2.addressInput}
              autoFocus
            />
          ) : (
            <span 
              className={styles2.addressText}
              onClick={() => {
                setIsEditingAddress(true);
                setEditingAddress(selectedLocation.address || 
                  "n/a");
              }}
            >
              {selectedLocation.address || "n/a"}
            </span>
          )}
        </div>
      )}




      <div className={styles2.mapContainer}>
        <div id="map" className={styles2.map}></div>
      </div>

      <div className={styles2.footer}>

        {initialLocation && (<button
          onClick={() => {handleConfirm(false)}}
          className={`${styles2.deleteButton} ${
            !selectedLocation ? styles2.deleteButtonDisabled : ''
          }`}
        >
          <Trash size={16} />
          <span className={styles2.buttonText}>Delete</span>
        </button>)}


        <button onClick={() => {setSelectedLocation(null); onClose()}} className={styles2.cancelButton}>
          Cancel
        </button>
        <button
          onClick={() => {handleConfirm(true)}}
          disabled={!selectedLocation}
          className={`${styles2.confirmButton} ${
            !selectedLocation ? styles2.confirmButtonDisabled : ''
          }`}
        >
          <Check size={16} />
          <span className={styles2.buttonText}>Confirm Location</span>
        </button>

        


      </div>
    </div>
  </div>
);
};


// Export both components
export { LocationPicker };