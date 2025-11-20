type StorageItems = Record<string, unknown>;

function withRuntimeErrorHandling<T>(callback: () => T): T {
  const lastError = chrome.runtime.lastError;
  if (lastError) {
    throw lastError;
  }
  return callback();
}

export async function getSync<T extends StorageItems>(keys: string[]): Promise<T> {
  return new Promise<T>((resolve, reject): void => {
    chrome.storage.sync.get(keys, (items): void => {
      try {
        const result = withRuntimeErrorHandling(() => items as T);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  });
}

export async function setSync(items: StorageItems): Promise<void> {
  return new Promise((resolve, reject): void => {
    chrome.storage.sync.set(items, (): void => {
      try {
        withRuntimeErrorHandling(() => undefined);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

