import 'package:socket_io_client/socket_io_client.dart' as IO;

class NotificationService {
  late IO.Socket socket;

  void init(String userId) {
    socket = IO.io('http://localhost:3000', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });

    socket.connect();

    socket.onConnect((_) {
      print('Connected to Notification Service');
      socket.emit('joinRoom', 'user_$userId');
    });

    socket.on('notification', (data) {
      print('Received Notification: $data');
      // Here we would typically stream this to a BLoC or show a local notification
    });

    socket.onDisconnect((_) => print('Disconnected'));
  }

  void dispose() {
    socket.disconnect();
  }
}
