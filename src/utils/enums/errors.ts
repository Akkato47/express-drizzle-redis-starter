export enum ErrorMessage {
  ERROR_404 = 'Страница не найдена. Пожалуйста, проверьте правильность введенного URL или вернитесь на главную страницу.',
  ERROR_500 = 'Внутренняя ошибка сервера. Попробуйте обновить страницу или вернитесь позже.',
  ERROR_AUTHORIZATION = 'Доступ запрещен. Убедитесь, что вы вошли в систему с правильными учетными данными.',
  ERROR_CONNECTION = 'Не удалось установить соединение с сервером. Проверьте ваше интернет-соединение и попробуйте снова.',
  ERROR_VALIDATION = 'Введенные данные некорректны. Пожалуйста, проверьте поля и исправьте ошибки.',
  ERROR_UPLOAD = 'Не удалось загрузить файл. Убедитесь, что файл соответствует требованиям и попробуйте снова.',
  ERROR_TIMEOUT = 'Запрос превысил время ожидания. Пожалуйста, попробуйте снова позже.',
  ERROR_FORMAT = 'Неподдерживаемый формат файла. Пожалуйста, загрузите файл в другом формате.',
  ERROR_LIMIT = 'Вы превысили лимит запросов. Пожалуйста, подождите некоторое время перед следующей попыткой.',
  ERROR_DATABASE = 'Не удалось получить доступ к базе данных. Пожалуйста, попробуйте позже.',
}
