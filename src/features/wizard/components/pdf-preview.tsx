import { forwardRef } from "react"
import type { PDFPreviewProps } from "../utils/pdf-generator"

const PDFPreview = forwardRef<HTMLDivElement, PDFPreviewProps>(
  ({ professional, patient, meals, currentDate, objectiveLabels }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          fontFamily: "Helvetica, Arial, system-ui, sans-serif",
          backgroundColor: "#ffffff",
          color: "#1a1a1a",
          padding: "32px",
          width: "210mm",
          minHeight: "297mm",
          display: "flex",
          flexDirection: "column",
          fontSize: "11px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
            paddingBottom: "16px",
            borderBottom: "2px solid #059669",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            {professional.logo && (
              <img
                src={professional.logo}
                alt="Logo"
                style={{ width: "48px", height: "48px", objectFit: "contain", marginRight: "12px" }}
                crossOrigin="anonymous"
              />
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "16px", fontWeight: "700", color: "#047857" }}>
                {professional.name}
              </span>
              <span style={{ fontSize: "11px", color: "#4b5563", marginTop: "3px" }}>
                Nutricionista - {professional.crn}
              </span>
              {professional.cpfCnpj && (
                <span style={{ fontSize: "10px", color: "#6b7280", marginTop: "2px" }}>
                  {professional.cpfCnpj}
                </span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: "15px", fontWeight: "700", color: "#047857" }}>
              Plano Alimentar
            </span>
            <span style={{ fontSize: "11px", color: "#6b7280", marginTop: "3px" }}>
              {currentDate}
            </span>
          </div>
        </div>

        {/* Patient Section */}
        <div
          style={{
            marginBottom: "20px",
            padding: "14px",
            backgroundColor: "#f0fdf4",
            borderRadius: "6px",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              fontWeight: "700",
              color: "#047857",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              margin: "0 0 10px 0",
            }}
          >
            Dados do Paciente
          </p>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
            <div style={{ width: "50%", display: "flex", flexDirection: "row", fontSize: "11px", marginBottom: "6px" }}>
              <span style={{ color: "#6b7280" }}>Nome: </span>
              <span style={{ fontWeight: "700", marginLeft: "4px" }}>{patient.name}</span>
            </div>
            <div style={{ width: "50%", display: "flex", flexDirection: "row", fontSize: "11px", marginBottom: "6px" }}>
              <span style={{ color: "#6b7280" }}>Idade: </span>
              <span style={{ fontWeight: "700", marginLeft: "4px" }}>{patient.age} anos</span>
            </div>
            <div style={{ width: "50%", display: "flex", flexDirection: "row", fontSize: "11px", marginBottom: "6px" }}>
              <span style={{ color: "#6b7280" }}>Peso Atual: </span>
              <span style={{ fontWeight: "700", marginLeft: "4px" }}>{patient.currentWeight} kg</span>
            </div>
            <div style={{ width: "50%", display: "flex", flexDirection: "row", fontSize: "11px", marginBottom: "6px" }}>
              <span style={{ color: "#6b7280" }}>Objetivo: </span>
              <span style={{ fontWeight: "700", marginLeft: "4px" }}>
                {objectiveLabels[patient.objective] || patient.objective}
              </span>
            </div>
          </div>
          {patient.clinicalNotes && (
            <div
              style={{
                marginTop: "10px",
                paddingTop: "10px",
                borderTop: "1px solid #a7f3d0",
              }}
            >
              <span style={{ fontSize: "11px", color: "#6b7280" }}>Observações:</span>
              <p
                style={{
                  fontSize: "11px",
                  color: "#1a1a1a",
                  whiteSpace: "pre-wrap",
                  margin: "3px 0 0 0",
                }}
              >
                {patient.clinicalNotes}
              </p>
            </div>
          )}
        </div>

        {/* Meals Section */}
        <div style={{ marginBottom: "20px", flexGrow: 1 }}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "700",
              color: "#047857",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              margin: "0 0 12px 0",
            }}
          >
            Plano de Refeições
          </p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {meals.map((meal) => (
              <div
                key={meal.id}
                style={{
                  borderLeft: "3px solid #10b981",
                  paddingLeft: "12px",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#059669",
                      backgroundColor: "#d1fae5",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      marginRight: "10px",
                    }}
                  >
                    {meal.time}
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#1f2937" }}>
                    {meal.title}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#4b5563",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.5",
                    margin: "0",
                  }}
                >
                  {meal.foods}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "16px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ fontSize: "10px", color: "#6b7280", width: "55%" }}>
            <p style={{ margin: "0 0 3px 0" }}>
              Este plano alimentar foi elaborado especificamente para o paciente acima.
            </p>
            <p style={{ margin: "0" }}>
              Em caso de dúvidas, entre em contato com seu nutricionista.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "160px" }}>
            <div
              style={{
                width: "160px",
                borderTop: "1px solid #9ca3af",
                marginTop: "40px",
                paddingTop: "6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "11px", fontWeight: "700", textAlign: "center" }}>
                {professional.name}
              </span>
              <span style={{ fontSize: "10px", color: "#6b7280", textAlign: "center", marginTop: "2px" }}>
                {professional.crn}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

PDFPreview.displayName = "PDFPreview"

export { PDFPreview }

