import { forwardRef } from "react"
import type { PDFPreviewProps } from "../utils/pdf-generator"

const PDFPreview = forwardRef<HTMLDivElement, PDFPreviewProps>(
  ({ professional, patient, meals, currentDate, objectiveLabels }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          backgroundColor: "#ffffff",
          color: "#1a1a1a",
          padding: "32px",
          width: "210mm",
          minHeight: "297mm",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "32px",
            paddingBottom: "24px",
            borderBottom: "2px solid #059669",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {professional.logo && (
              <img
                src={professional.logo}
                alt="Logo"
                style={{ width: "64px", height: "64px", objectFit: "contain" }}
                crossOrigin="anonymous"
              />
            )}
            <div>
              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#047857",
                  margin: "0",
                }}
              >
                {professional.name}
              </h1>
              <p style={{ fontSize: "14px", color: "#4b5563", margin: "4px 0 0 0" }}>
                Nutricionista - {professional.crn}
              </p>
              {professional.cpfCnpj && (
                <p style={{ fontSize: "12px", color: "#6b7280", margin: "0" }}>
                  {professional.cpfCnpj}
                </p>
              )}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#047857",
                margin: "0",
              }}
            >
              Plano Alimentar
            </h2>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: "4px 0 0 0" }}>
              {currentDate}
            </p>
          </div>
        </div>

        {/* Patient Info */}
        <div
          style={{
            marginBottom: "32px",
            padding: "16px",
            backgroundColor: "#f0fdf4",
            borderRadius: "8px",
          }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#047857",
              marginBottom: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: "0 0 12px 0",
            }}
          >
            Dados do Paciente
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              fontSize: "14px",
            }}
          >
            <div>
              <span style={{ color: "#6b7280" }}>Nome:</span>{" "}
              <span style={{ fontWeight: "500" }}>{patient.name}</span>
            </div>
            <div>
              <span style={{ color: "#6b7280" }}>Idade:</span>{" "}
              <span style={{ fontWeight: "500" }}>{patient.age} anos</span>
            </div>
            <div>
              <span style={{ color: "#6b7280" }}>Peso Atual:</span>{" "}
              <span style={{ fontWeight: "500" }}>{patient.currentWeight} kg</span>
            </div>
            <div>
              <span style={{ color: "#6b7280" }}>Objetivo:</span>{" "}
              <span style={{ fontWeight: "500" }}>
                {objectiveLabels[patient.objective] || patient.objective}
              </span>
            </div>
          </div>
          {patient.clinicalNotes && (
            <div
              style={{
                marginTop: "12px",
                paddingTop: "12px",
                borderTop: "1px solid #a7f3d0",
              }}
            >
              <span style={{ color: "#6b7280", fontSize: "14px" }}>
                Observações:
              </span>
              <p
                style={{
                  fontSize: "14px",
                  marginTop: "4px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {patient.clinicalNotes}
              </p>
            </div>
          )}
        </div>

        {/* Meals */}
        <div style={{ marginBottom: "32px" }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#047857",
              marginBottom: "16px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: "0 0 16px 0",
            }}
          >
            Plano de Refeições
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {meals.map((meal) => (
              <div
                key={meal.id}
                style={{
                  borderLeft: "4px solid #10b981",
                  paddingLeft: "16px",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#059669",
                      backgroundColor: "#d1fae5",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {meal.time}
                  </span>
                  <h4 style={{ fontWeight: "600", color: "#1f2937", margin: "0" }}>
                    {meal.title}
                  </h4>
                </div>
                <p
                  style={{
                    fontSize: "14px",
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
            paddingTop: "32px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              <p>Este plano alimentar foi elaborado especificamente para o paciente acima.</p>
              <p>Em caso de dúvidas, entre em contato com seu nutricionista.</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "192px",
                  borderTop: "1px solid #9ca3af",
                  paddingTop: "8px",
                }}
              >
                <p style={{ fontSize: "14px", fontWeight: "500", margin: "0" }}>
                  {professional.name}
                </p>
                <p style={{ fontSize: "12px", color: "#6b7280", margin: "0" }}>
                  {professional.crn}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

PDFPreview.displayName = "PDFPreview"

export { PDFPreview }
