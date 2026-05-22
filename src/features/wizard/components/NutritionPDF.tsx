import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer"
import type { PDFPreviewProps } from "../utils/pdf-generator"

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    padding: 32,
    fontSize: 11,
    color: "#1a1a1a",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#059669",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 48,
    height: 48,
    objectFit: "contain",
    marginRight: 12,
  },
  professionalInfo: {
    flexDirection: "column",
  },
  professionalName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#047857",
  },
  professionalSubtitle: {
    fontSize: 11,
    color: "#4b5563",
    marginTop: 3,
  },
  professionalCpf: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  planTitle: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: "#047857",
  },
  planDate: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 3,
  },
  patientSection: {
    marginBottom: 20,
    padding: 14,
    backgroundColor: "#f0fdf4",
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#047857",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  patientGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  patientField: {
    width: "50%",
    fontSize: 11,
    marginBottom: 6,
    flexDirection: "row",
  },
  patientLabel: {
    color: "#6b7280",
  },
  patientValue: {
    fontFamily: "Helvetica-Bold",
    marginLeft: 4,
  },
  clinicalNotesContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#a7f3d0",
  },
  clinicalNotesLabel: {
    fontSize: 11,
    color: "#6b7280",
  },
  clinicalNotesText: {
    fontSize: 11,
    marginTop: 3,
    color: "#1a1a1a",
  },
  mealsSection: {
    marginBottom: 20,
    flexGrow: 1,
  },
  mealsSectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#047857",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  mealCard: {
    borderLeftWidth: 3,
    borderLeftColor: "#10b981",
    paddingLeft: 12,
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  timeBadge: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
    backgroundColor: "#d1fae5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 10,
  },
  mealTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1f2937",
  },
  mealFoods: {
    fontSize: 11,
    color: "#4b5563",
    lineHeight: 1.5,
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "auto",
  },
  footerNotes: {
    fontSize: 10,
    color: "#6b7280",
    width: "55%",
  },
  footerNote: {
    marginBottom: 3,
  },
  signatureBlock: {
    alignItems: "center",
    width: 160,

    paddingTop: 40,
  },
  signatureLine: {
    width: 160,

    paddingTop: 8,

    borderTopWidth: 1,
    borderTopColor: "#9ca3af",

    alignItems: "center",
  },
  signatureName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  signatureCrn: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 2,
  },
})

export function NutritionPDF({
  professional,
  patient,
  meals,
  currentDate,
  objectiveLabels,
}: PDFPreviewProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header} wrap={false}>
          <View style={styles.headerLeft}>
            {professional.logo && (
              <Image src={professional.logo} style={styles.logo} />
            )}
            <View style={styles.professionalInfo}>
              <Text style={styles.professionalName}>{professional.name}</Text>
              <Text style={styles.professionalSubtitle}>
                Nutricionista - {professional.crn}
              </Text>
              {professional.cpfCnpj && (
                <Text style={styles.professionalCpf}>
                  {professional.cpfCnpj}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.planTitle}>Plano Alimentar</Text>
            <Text style={styles.planDate}>{currentDate}</Text>
          </View>
        </View>

        {/* Patient Section */}
        <View style={styles.patientSection} wrap={false}>
          <Text style={styles.sectionTitle}>Dados do Paciente</Text>
          <View style={styles.patientGrid}>
            <View style={styles.patientField}>
              <Text style={styles.patientLabel}>Nome: </Text>
              <Text style={styles.patientValue}>{patient.name}</Text>
            </View>
            <View style={styles.patientField}>
              <Text style={styles.patientLabel}>Idade: </Text>
              <Text style={styles.patientValue}>{patient.age} anos</Text>
            </View>
            <View style={styles.patientField}>
              <Text style={styles.patientLabel}>Peso Atual: </Text>
              <Text style={styles.patientValue}>
                {patient.currentWeight} kg
              </Text>
            </View>
            <View style={styles.patientField}>
              <Text style={styles.patientLabel}>Objetivo: </Text>
              <Text style={styles.patientValue}>
                {objectiveLabels[patient.objective] || patient.objective}
              </Text>
            </View>
          </View>
          {patient.clinicalNotes && (
            <View style={styles.clinicalNotesContainer}>
              <Text style={styles.clinicalNotesLabel}>Observações:</Text>
              <Text style={styles.clinicalNotesText}>
                {patient.clinicalNotes}
              </Text>
            </View>
          )}
        </View>

        {/* Meals Section */}
        <View style={styles.mealsSection}>
          <Text style={styles.mealsSectionTitle}>Plano de Refeições</Text>
          {meals.map((meal) => (
            <View key={meal.id} style={styles.mealCard} wrap={false}>
              <View style={styles.mealHeader}>
                <Text style={styles.timeBadge}>{meal.time}</Text>
                <Text style={styles.mealTitle}>{meal.title}</Text>
              </View>
              <Text style={styles.mealFoods}>{meal.foods}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer} wrap={false}>
          <View style={styles.footerNotes}>
            <Text style={styles.footerNote}>
              Este plano alimentar foi elaborado especificamente para o paciente
              acima.
            </Text>
            <Text style={styles.footerNote}>
              Em caso de dúvidas, entre em contato com seu nutricionista.
            </Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureName}>{professional.name}</Text>
              <Text style={styles.signatureCrn}>{professional.crn}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
