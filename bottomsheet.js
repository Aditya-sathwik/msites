  const initializeBottomSheet = (
    containerId,
    overlayId,
    contentId,
    headerContent,
    bodyContent,
    footerContent = '',
    minHeight = 20,
    maxHeight = 80,
    defaultHeight = 80,
    inputdiv
  ) => {
    // Define the bottom sheet HTML template
    const bottomSheetHTML = `
      <div class="bottom-sheet-container" id="${containerId}">
        <div class="sheet-overlay" id="${overlayId}"></div>
        <div class="sheet-content" id="${contentId}">
 
            ${headerContent}
          
          <div class="sheet-body">
            ${bodyContent}
          </div>
          <div class="sheet-footer" style="${!footerContent ? 'display: none;' : ''}">
          ${footerContent || ''}
        </div>
        </div>
      </div>
    `;
    $(`#${inputdiv}`).empty()
    $(`#${inputdiv}`).append(bottomSheetHTML);
  
    // Get references to the newly added elements
    const bottomSheetContainer = document.getElementById(containerId);
    const sheetOverlay = document.getElementById(overlayId);
    const sheetContent = document.getElementById(contentId);
    const dragIcon = bottomSheetContainer.querySelector(".sheet-header");
  
    let isDragging = false,
      startY,
      startHeight;
  
    const showBottomSheet = () => {
      bottomSheetContainer.classList.add("show");
      document.body.style.overflowY = "hidden";
      updateSheetHeight(defaultHeight);
    };
  
    const updateSheetHeight = (height) => {

      sheetContent.style.height = `${height}vh`;
      bottomSheetContainer.classList.toggle("fullscreen", height === maxHeight);
    };
  
    const hideBottomSheet = () => {
      bottomSheetContainer.classList.remove("show");
      document.body.style.overflowY = "auto";
    };
  
    const dragStart = (e) => {
      isDragging = true;
      startY = e.pageY || e.touches?.[0].pageY;
      startHeight = parseInt(sheetContent.style.height, 10); // Parse height as integer
      bottomSheetContainer.classList.add("dragging");
    };
  
    const dragging = (e) => {
      if (!isDragging) return;
      const delta = startY - (e.pageY || e.touches?.[0].pageY);
      const newHeight = startHeight + (delta / window.innerHeight) * 100;
      updateSheetHeight(newHeight);
    };
  
    const dragStop = () => {
      isDragging = false;
      bottomSheetContainer.classList.remove("dragging");
      const sheetHeight = parseInt(sheetContent.style.height, 10);
      if (sheetHeight < minHeight) {
        hideBottomSheet();
      } else {
        updateSheetHeight(defaultHeight); // Reset to default height
      }
    };
  
    // Initialize the bottom sheet to be shown by default
    showBottomSheet();
  
    // Add event listeners for drag interactions
    if (dragIcon) {
      dragIcon.addEventListener("mousedown", dragStart);
      document.addEventListener("mousemove", dragging);
      document.addEventListener("mouseup", dragStop);
  
      dragIcon.addEventListener("touchstart", dragStart);
      document.addEventListener("touchmove", dragging);
      document.addEventListener("touchend", dragStop);
    } else {
      
    }

    $(document).on('click', '#crossicon', function () {
hideBottomSheet()
    });
  
    // Add event listener for overlay click to hide bottom sheet
    sheetOverlay.addEventListener("click", hideBottomSheet);
  
    // Return the bottom sheet HTML
    return bottomSheetHTML;
  };
  
  // Example usage:
  
  
  