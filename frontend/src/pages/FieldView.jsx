import React, { useEffect, useState } from "react";
import PixelFieldView from "../components/analytics/PixelFieldView";
import { useParams, useNavigate } from "react-router-dom";
import { getAllFields, adjustField } from "../api/analyticsAPI";

/**
 * FieldView route: /field/:id
 * If no field found, redirects back to Analytics
 */
export default function FieldView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFields = async () => {
    try {
      const json = await getAllFields();
      const fields = json.fields || [];
      const found = fields.find(f => Number(f.field_id) === Number(id));
    
      if (!found) {
        // redirect back
        navigate("/analytics");
        return;
      }
      setField(found);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
    // poll every 3s to keep view updated like heatmap
    const t = setInterval(fetchFields, 3000);
    return () => clearInterval(t);
  }, [id]);

  const handleAdjust = async (fieldId) => {
    try {
      await adjustField(fieldId);
      // immediately fetch to show updated status
      await fetchFields();
    } catch(e) {
      console.error("Error adjusting field:", e);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {loading && <div>Loading field...</div>}
      {!loading && field && (
        <PixelFieldView field={field} onAdjust={handleAdjust} onClose={() => navigate("/field/:id")} />
      )}
    </div>
  );
}
