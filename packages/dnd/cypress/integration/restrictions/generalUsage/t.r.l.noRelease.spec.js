/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
let elmBox;
let startingPointX;
let startingPointY;

context(
  "Moving A Complete Restricted Element - Dragged is not released - top/right/left",
  () => {
    before(() => {
      cy.visit("http://localhost:3001/restricted");
    });

    it("Getting the first element (#item-rest-1)", () => {
      cy.get("#item-rest-1").then((elm) => {
        elmBox = elm[0].getBoundingClientRect();
        startingPointX = elmBox.x + elmBox.width / 2;
        startingPointY = elmBox.y + elmBox.height / 2;

        cy.get("#item-rest-1").trigger("mousedown", {
          button: 0,
        });
      });
    });

    it("Transforms element (#item-rest-1) to the top outside the list", () => {
      for (let i = 52; i >= 0; i -= 1) {
        cy.get("#item-rest-1").trigger("mousemove", {
          clientY: startingPointY - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // cy.wait(0);
      }
    });

    it("Dragged still inside the definition area", () => {
      cy.get("#item-rest-1").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0.59375)"
      );
    });

    it("Transforms element (#item-rest-1) to restricted right", () => {
      for (let i = 0; i < 52; i += 1) {
        cy.get("#item-rest-1").trigger("mousemove", {
          clientX: startingPointX + i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // // cy.wait(0);
      }
    });

    it("Dragged still inside the definition area", () => {
      cy.get("#item-rest-1").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 1)"
      );
    });

    it("Transforms element (#item-rest-1) to restricted left", () => {
      for (let i = 52; i > 0; i -= 1) {
        cy.get("#item-rest-1").trigger("mousemove", {
          clientX: startingPointX - i,
          force: true,
        });
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        // // cy.wait(0);
      }
    });

    it("Dragged still inside the definition area", () => {
      cy.get("#item-rest-1").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 1)"
      );
    });

    it("Triggers mouseup", () => {
      cy.get("#item-rest-1").trigger("mouseup", { force: true });
    });

    it("Siblings positions are not changed", () => {
      cy.get("#item-rest-1").should(
        "have.css",
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)"
      );
      cy.get("#item-rest-2").should("have.css", "transform", "none");
      cy.get("#item-rest-3").should("have.css", "transform", "none");
      cy.get("#item-rest-4").should("have.css", "transform", "none");
      cy.get("#item-rest-5").should("have.css", "transform", "none");
    });
  }
);
