import React, { useState } from "react";
import { StepComponentProps, Step } from "./add-client.component";
import agendaIconUrl from "../../icons/148705-essential-collection/svg/agenda.svg";
import { useCss } from "kremling";

export default function Services(props: StepComponentProps) {
  const [services, setServices] = useState(defaultServices);
  const scope = useCss(css);

  return (
    <div {...scope}>
      <div className="hints-and-instructions">
        <div>
          <img src={agendaIconUrl} className="hint-icon" />
        </div>
        <div className="instruction">
          What services are they interested in today?
          <div className="warning">
            This is not what Comunidades Unidas did for them in their first
            visit, but the services they might want in the future.
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <div className="vertical-options">
            <label>
              <input
                type="checkbox"
                name="services"
                value="citizenship"
                checked={services.citizenship}
                onChange={handleChange}
                autoFocus
              />
              <span>Citizenship</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="services"
                value="familyPetition"
                checked={services.familyPetition}
                onChange={handleChange}
              />
              <span>Family Petition</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="services"
                value="workersRightsAndSafety"
                checked={services.workersRightsAndSafety}
                onChange={handleChange}
              />
              <span>Workers' rights / safety</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="services"
                value="DACA"
                checked={services.DACA}
                onChange={handleChange}
              />
              <span>DACA</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="services"
                value="youthGroup"
                checked={services.youthGroup}
                onChange={handleChange}
              />
              <span>Youth group</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="services"
                value="leadershipClasses"
                checked={services.leadershipClasses}
                onChange={handleChange}
              />
              <span>Promoters / Leadership classes</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="services"
                value="SNAP"
                checked={services.SNAP}
                onChange={handleChange}
              />
              <span>SNAP / Food Stamps</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="services"
                value="chronicDiseaseTesting"
                checked={services.chronicDiseaseTesting}
                onChange={handleChange}
              />
              <span>Evidence of chronic diseases</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="services"
                value="nutrition"
                checked={services.nutrition}
                onChange={handleChange}
              />
              <span>Nutrition</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="services"
                value="groceryTour"
                checked={services.groceryTour}
                onChange={handleChange}
              />
              <span>Visit to the supermarket</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="services"
                value="cookingClass"
                checked={services.cookingClass}
                onChange={handleChange}
              />
              <span>Food Demonstration</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="services"
                value="communityEngagement"
                checked={services.communityEngagement}
                onChange={handleChange}
              />
              <span>Community Organization / Advocacy</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="services"
                value="financialEducation"
                checked={services.financialEducation}
                onChange={handleChange}
              />
              <span>Education / Financial Advising</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="services"
                value="financialCoaching"
                checked={services.financialCoaching}
                onChange={handleChange}
              />
              <span>Finacial Coaching</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="services"
                value="reference"
                checked={services.reference}
                onChange={handleChange}
              />
              <input
                type="text"
                name="services"
                value={services.referenceDescription}
                onChange={handleChange}
              />
              <span>Reference</span>
            </label>
            <label>
              <input
                type="checkbox"
                name="services"
                value="other"
                checked={services.other}
                onChange={handleChange}
              />
              <input
                type="text"
                name="services"
                value={services.otherDescription}
                onChange={handleChange}
              />
              <span>Other</span>
            </label>
          </div>
        </div>
        <div className="actions">
          <button
            type="button"
            className="secondary"
            onClick={() => props.goBack(Step.DEMOGRAPHICS_INFORMATION)}
          >
            Go back
          </button>
          <button type="submit" className="primary">
            Next step
          </button>
        </div>
      </form>
    </div>
  );

  function handleChange(evt) {
    setServices({ ...services, [evt.target.value]: evt.target.checked });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    props.nextStep(Step.CONFIRM, {});
  }
}

const defaultServices = {
  citizenship: false,
  familyPetition: false,
  workersRightsAndSafety: false,
  DACA: false,
  youthGroup: false,
  leadershipClasses: false,
  SNAP: false,
  chronicDiseaseTesting: false,
  nutrition: false,
  groceryTour: false,
  cookingClass: false,
  communityEngagement: false,
  financialEducation: false,
  financialCoaching: false,
  reference: false,
  referenceDescription: "",
  other: false,
  otherDescription: ""
};

const css = `
& .warning {
  font-weight: bold;
  font-style: italic;
  margin-top: 8rem;
}
`;
