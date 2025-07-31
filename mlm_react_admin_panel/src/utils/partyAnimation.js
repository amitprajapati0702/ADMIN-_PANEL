import anime from "animejs/lib/anime.es.js";


const PartyTransition = (direction,step,setStep) => {
    const currentStep = `.step-${step}`;
    const nextStep = direction === 'next' ? `.step-${step + 1}` : `.step-${step - 1}`;

    const currentElement = document.querySelector(currentStep);
    const nextElement = document.querySelector(nextStep);

    // if (!nextElement) return;

    // Set the next element to be visible
    // nextElement.style.display = 'block';

    // Fade out the current step
    anime({
      targets: currentElement,
      opacity: [1, 0],
      easing: 'easeInOutQuad',
      duration: 500,
      complete: () => {
        // Update the step state
        setStep(prevStep => {
          if (direction === 'next') {
            // Increment only if prevStep is less than 3
            return prevStep < 3 ? prevStep + 1 : prevStep;
          } else {
            // Decrement only if prevStep is greater than 1
            return prevStep > 1 ? prevStep - 1 : prevStep;
          }
        });
        
        // Fade in the next step
        anime({
          targets: nextElement,
          opacity: [0, 1],
          easing: 'easeInOutQuad',
          duration: 500,
          complete: () => {
            // Ensure the previous step is hidden after transition
            // if (direction === 'next') {
            //   currentElement.style.display = 'none';
            // } else {
            //   nextElement.style.display = 'block';
            // }
          }
        });
      }
    });
};

export default PartyTransition