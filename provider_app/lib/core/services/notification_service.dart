import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

// Top-level function for background handling
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  debugPrint("Handling a background message: ${message.messageId}");
}

class NotificationService {
  final Dio _dio;
  final FlutterSecureStorage _storage;
  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;

  NotificationService(this._dio, this._storage);

  Future<void> init() async {
    // 1. Request Permission
    NotificationSettings settings = await _firebaseMessaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      debugPrint('User granted permission');
    } else {
      debugPrint('User declined or has not accepted permission');
      return; 
    }

    // 2. Set background handler
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

    // 3. Get Token and Register
    String? token = await _firebaseMessaging.getToken();
    if (token != null) {
      debugPrint('FCM Token: $token');
      await _registerToken(token);
    }

    // 4. Handle Token Refresh
    _firebaseMessaging.onTokenRefresh.listen(_registerToken);

    // 5. Handle Foreground Messages
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      debugPrint('Got a message whilst in the foreground!');
      debugPrint('Message data: ${message.data}');

      if (message.notification != null) {
        debugPrint('Message also contained a notification: ${message.notification}');
        // Show local notification or update UI via Bloc
      }
    });

    // 6. Handle Background/Terminated Taps (Deep Linking)
    _setupInteractedMessage();
  }

  Future<void> _registerToken(String token) async {
    try {
      // Platform detection
      String platform = 'web';
      if (!kIsWeb) {
        if (Platform.isAndroid) platform = 'android';
        if (Platform.isIOS) platform = 'ios';
      }

      await _dio.post('/notifications/token', data: {
        'deviceToken': token,
        'platform': platform,
      });
      debugPrint('Token registered with backend');
    } catch (e) {
      debugPrint('Failed to register token: $e');
    }
  }

  Future<void> _setupInteractedMessage() async {
    // Get any messages which caused the application to open from a terminated state.
    RemoteMessage? initialMessage = await _firebaseMessaging.getInitialMessage();

    if (initialMessage != null) {
      _handleMessage(initialMessage);
    }

    // Also handle any interaction when the app is in the background via a Stream listener
    FirebaseMessaging.onMessageOpenedApp.listen(_handleMessage);
  }

  void _handleMessage(RemoteMessage message) {
    if (message.data['type'] == 'BOOKING_CREATED' ||
        message.data['type'] == 'BOOKING_ACCEPTED' ||
        message.data['type'] == 'BOOKING_COMPLETED' || 
        message.data['type'] == 'BOOKING_REJECTED') {
          
       // TODO: Use a global navigation key or router to navigate to Booking Details
       debugPrint('Deep Link to Booking: ${message.data['bookingId']}');
    }
  }
}
