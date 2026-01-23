import "jspdf";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

declare module "jspdf-autotable" {
  export interface UserOptions {
    head?: any[][];
    body?: any[][];
    startY?: number;
    theme?: string;
    headStyles?: any;
    styles?: any;
    margin?: any;
  }

  export default function autoTable(
    doc: import("jspdf").jsPDF,
    options: UserOptions
  ): void;
}
