window.onload = function(): void {
  let isDarkModeEnabled: 'yes' | 'no' | undefined;

  function enableDark(): void {
    document.documentElement.classList.remove('vanilla');
  }

  function disableDark(): void {
    document.documentElement.classList.add('vanilla');
  }

  chrome.storage.sync.get(['dark_mode'], function(result: Record<string, unknown>): void {
    isDarkModeEnabled = result['dark_mode'] as 'yes' | 'no' | undefined;

    if (isDarkModeEnabled === 'yes' || isDarkModeEnabled === 'no') {
      if (isDarkModeEnabled === 'no') {
        disableDark();
      }
    } else {
      chrome.storage.sync.set({ dark_mode: 'yes' }, function(): void {
        isDarkModeEnabled = 'yes';
      });
    }

    const logoWrapper = document.getElementById('wrapper-headerOmnivoxLogo');
    if (!logoWrapper) {
      return;
    }

    const div = document.createElement('a');
    div.setAttribute('id', 'themeToggle');
    div.setAttribute('title', 'Toggle Light/Dark Mode');
    div.setAttribute('style', 'display: flex; height: 100%; justify-content: center; align-items: center; margin-left: 28px; cursor: pointer;');
    div.innerHTML = `<img style="height: 60%" src="${chrome.runtime.getURL('/dist/inject/icon.svg')}" class="logo-lea" alt="Toggle Light/Dark Mode">`;
    logoWrapper.appendChild(div);

    document.getElementById('themeToggle')?.addEventListener('click', function(): void {
      if (isDarkModeEnabled === 'yes') {
        disableDark();
        chrome.storage.sync.set({ dark_mode: 'no' }, function(): void {
          isDarkModeEnabled = 'no';
        });
      } else if (isDarkModeEnabled === 'no') {
        enableDark();
        chrome.storage.sync.set({ dark_mode: 'yes' }, function(): void {
          isDarkModeEnabled = 'yes';
        });
      }
    });
  });
};

