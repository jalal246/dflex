/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
let elmBox;
let startingPointX;
let startingPointY;

let stepsX;
let stepsY;

// const waitingTime = 0;

context("Moving out then insert - Up/Down - No release", () => {
  before(() => {
    cy.visit("http://localhost:3001");
  });

  it("Getting the element (container2 |> elm-1)", () => {
    cy.get("#id-2").then((elm) => {
      elmBox = elm[0].getBoundingClientRect();
      startingPointX = elmBox.x + elmBox.width / 2;
      startingPointY = elmBox.y + elmBox.height / 2;

      cy.get("#id-2").trigger("mousedown", {
        button: 0,
      });
    });
  });

  it("Transforms (container2 |> elm-1) out - two siblings", () => {
    // steps = elmBox.height + 2 + 180;
    stepsX = 185;

    for (let i = 0; i < stepsX; i += 1) {
      cy.get("#id-2").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(waitingTime);
    }

    // stepsX -= startingPointX;

    stepsY = 94;
    for (let i = 0; i < stepsY; i += 1) {
      cy.get("#id-2").trigger("mousemove", {
        clientY: startingPointY + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(waitingTime);
    }
  });

  it("Insert the element inside the list", () => {
    for (let i = stepsX; i >= 0; i -= 1) {
      cy.get("#id-2").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(waitingTime);
    }
  });

  it("Siblings have new positions", () => {
    cy.get("#id-3").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -58)"
    );

    cy.get("#id-4").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -58)"
    );
  });

  it("Transforms (container2 |> elm-1) out - two siblings", () => {
    // steps = elmBox.height + 2 + 180;
    stepsX = 185;

    for (let i = 0; i < stepsX; i += 1) {
      cy.get("#id-2").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }

    for (let i = stepsY; i < stepsY + 98; i += 1) {
      cy.get("#id-2").trigger("mousemove", {
        clientY: startingPointY + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(0);
    }
    stepsY += 98;
  });

  it("Insert the element inside the list", () => {
    for (let i = stepsX; i >= 0; i -= 1) {
      cy.get("#id-2").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(waitingTime);
    }
  });

  it("Siblings have new positions", () => {
    cy.get("#id-3").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -58)"
    );

    cy.get("#id-4").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -58)"
    );

    cy.get("#id-5").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -58)"
    );

    cy.get("#id-6").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -58)"
    );
  });

  it("Transforms (container2 |> elm-1) out - two siblings", () => {
    // steps = elmBox.height + 2 + 180;
    stepsX = 185;

    for (let i = 0; i < stepsX; i += 1) {
      cy.get("#id-2").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(waitingTime);
    }

    for (let i = 0; i < stepsY + 100; i += 1) {
      cy.get("#id-2").trigger("mousemove", {
        clientY: startingPointY + i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(waitingTime);
    }
    // stepsY += 100;
  });

  it("Insert the element inside the list", () => {
    for (let i = stepsX; i >= 0; i -= 1) {
      cy.get("#id-2").trigger("mousemove", {
        clientX: startingPointX - i,
        force: true,
      });
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      // cy.wait(waitingTime);
    }
  });

  it("Triggers mouseup", () => {
    cy.get("#id-2").trigger("mouseup", { force: true });
  });

  it("Siblings have new positions", () => {
    cy.get("#id-2").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 348)"
    );

    cy.get("#id-3").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -58)"
    );

    cy.get("#id-4").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -58)"
    );

    cy.get("#id-5").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -58)"
    );

    cy.get("#id-6").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -58)"
    );

    cy.get("#id-7").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -58)"
    );

    cy.get("#id-8").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, -58)"
    );
  });

  stepsX = 0;
  stepsY = 0;
});
