import { DetectionCanvas } from "./detectionCanvas";

export class Sidebar {
  private static sidebarElement: HTMLDivElement =
    document.querySelector(".detection-sidebar")!;

  private static sidebarExpandBtn: HTMLButtonElement = document.querySelector(
    "button.sidebar-expand-btn"
  )!;

  static expand() {
    this.sidebarElement.classList.remove("shrink");
  }

  static shrink() {
    this.sidebarElement.classList.add("shrink");
  }

  static getPredictionCards() {
    const cards = Sidebar.sidebarElement.querySelectorAll(".detection-card");

    return cards;
  }

  static get sidebar() {
    return this.sidebarElement;
  }

  static removeCard(card: Element) {
    this.sidebarElement.removeChild(card);
  }

  static addCard(card: HTMLDivElement) {
    this.sidebarElement.append(card);
  }

  static removePredictions(detectionCanvasList: DetectionCanvas[]) {
    detectionCanvasList.length = 0;

    const cards = this.sidebarElement.querySelectorAll(".detection-card");
    cards.forEach((card) => {
      this.sidebarElement.removeChild(card);
    });
  }

  private static _ = (() => {
    this.sidebarExpandBtn.addEventListener("click", () => {
      this.sidebarElement.classList.toggle("shrink");
    });
  })();
}
