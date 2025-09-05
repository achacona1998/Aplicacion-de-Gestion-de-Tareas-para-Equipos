const validateMessage = ({ sender, recipient, title, message }) => {
  if (!sender) {
    return 'El remitente es requerido';
  }
  if (!recipient) {
    return 'El destinatario es requerido';
  }
  if (!title || title.trim().length === 0) {
    return 'El título es requerido';
  }
  if (!message || message.trim().length === 0) {
    return 'El mensaje es requerido';
  }
  if (title.length > 100) {
    return 'El título no puede exceder los 100 caracteres';
  }
  if (message.length > 1000) {
    return 'El mensaje no puede exceder los 1000 caracteres';
  }
  return null;
};

module.exports = {
  validateMessage
};