import { ElNotification } from "element-plus";

export const notification = (title, message, type,cb, eventType ) => {
  const notificationInstance = ElNotification({
    title : title || 'Notification',
    message : message || 'No message provided',
    type : type || 'info',
    duration : 5000,
    [eventType]: () => {
      if(cb){
        cb()
      }
      notificationInstance.close()
    }
  })
  
}