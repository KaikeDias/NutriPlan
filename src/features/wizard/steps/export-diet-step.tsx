import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWizardContext } from "../context/wizard-context";
import { getPatientGoalLabel } from "../types/patient-goal";
import { Download, FileText, RotateCcw } from "lucide-react";
import { PDFPreview } from "../components/pdf-preview";
import { usePDFExport } from "../hooks/usePDFExport";
import {
  mapWizardDataToPDF,
  validatePDFData,
  generatePDFFilename,
} from "../utils/pdf-generator";

export default function ExportDietStep() {
  const { data, prev, goToStep, updateSection } = useWizardContext();
  const { downloadPDF, loading, error, resetError } = usePDFExport();

  const validation = validatePDFData(data);

  const handleDownloadClick = async () => {
    if (!validation.isValid) {
      alert(
        "Não é possível baixar o PDF. Problemas encontrados:\n\n" +
        validation.errors.join("\n")
      );
      return;
    }

    const filename = generatePDFFilename(data.patient.name);
    await downloadPDF(filename, mapWizardDataToPDF(data));
  };

  const handleNewPlanClick = () => {
    if (
      confirm(
        "Tem certeza que deseja criar um novo plano? Os dados do paciente serão resetados, mas as informações do nutricionista serão mantidas."
      )
    ) {
      const emptyData = {
        patient: {
          name: "",
          age: 0,
          weight: 0,
          goal: "OTHER" as const,
          observations: "",
        },
        diet: { meals: [] },
      };
      updateSection("patient", emptyData.patient);
      updateSection("diet", emptyData.diet);
      goToStep(1);
    }
  }

  return (
    <div>
      <p className="text-gray-400">
        Revise o plano alimentar e gere o PDF para entregar ao paciente.
      </p>
      <div className="mt-8 grid grid-cols-3 gap-5">
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-400 text-sm">Paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{data.patient.name}</p>
            <p className="text-gray-400 text-sm">
              {data.patient.age} anos, {data.patient.weight}kg
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-400 text-sm">Objetivo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {getPatientGoalLabel(data.patient.goal)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-400 text-sm">Refeições</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {data.diet.meals.length}{" "}
              {data.diet.meals.length === 1 ? "refeição" : "refeições"} no
              plano
            </p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-900/30 border border-red-700 rounded text-red-300 text-sm">
          <p>Erro ao gerar PDF: {error}</p>
          <button
            onClick={resetError}
            className="text-red-200 underline text-xs mt-2"
          >
            Descartar mensagem
          </button>
        </div>
      )}

      <div className="mt-8 flex justify-between pt-4">
        <Button
          type="button"
          onClick={prev}
          variant="outline"
          className="border-gray-700"
        >
          Anterior
        </Button>
        <div className="flex gap-4">
          <Button onClick={handleNewPlanClick} variant={"outline"}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Novo plano
          </Button>
          <Button
            onClick={handleDownloadClick}
            disabled={loading || !validation.isValid}
            className="bg-teal-600 hover:bg-teal-700 font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            {loading ? "Gerando..." : "Baixar PDF"}
          </Button>
        </div>
      </div>

      <div className="mt-12 border-t pt-8">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-semibold">Pré-visualização do PDF</h2>
        </div>

        <div className="border border-gray-700 rounded-lg bg-gray-900 p-4 max-h-[600px] overflow-y-auto">
          <PDFPreview {...mapWizardDataToPDF(data)} />
        </div>
      </div>

    </div>
  )
}