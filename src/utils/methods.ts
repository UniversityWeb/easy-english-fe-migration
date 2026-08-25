export const formatDate = (isoString) => {
  console.log(`isoString: ${isoString}`);
  const date = new Date(isoString);

  if (isNaN(date)) {
    return 'Invalid Date';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const delayLoading = async (startTime) => {
  const elapsedTime = Date.now() - startTime;
  const delay = Math.max(0, 500 - elapsedTime);
  await new Promise((resolve) => setTimeout(resolve, delay));
};

export const validatePassword = (password, confirmPassword) => {
  const errors = [];
  if (password.length < 8)
    errors.push('Password must be at least 8 characters long.');
  if (!/[A-Z]/.test(password))
    errors.push('Password must contain at least one uppercase letter.');
  if (!/[a-z]/.test(password))
    errors.push('Password must contain at least one lowercase letter.');
  if (!/\d/.test(password))
    errors.push('Password must contain at least one digit.');
  if (!/[!@#$%^&*]/.test(password))
    errors.push('Password must contain at least one special character.');
  if (password !== confirmPassword)
    errors.push('Password and Confirm Password do not match.');
  return errors;
};

export const formatVNDMoney = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

export const isPlayableMp3 = async (url) => {
  return new Promise((resolve) => {
    const audio = new Audio();

    // Optional: quick check for supported type
    if (!audio.canPlayType('audio/mpeg')) {
      return resolve(false);
    }

    // Set up event handlers
    audio.src = url;
    audio.addEventListener('canplaythrough', () => resolve(true), {
      once: true,
    });
    audio.addEventListener('error', () => resolve(false), { once: true });

    // Start loading
    audio.load();
  });
};
