import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:dotech_customer/core/globals.dart';

// Top-level function for background handling
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  debugPrint("Handling a background message: ${message.messageId}");
}

class NotificationService {
  // Track processed messages to prevent duplicate navigation
  final Set<String> _processedMessageIds = {};

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
    try {
      String? token = await _firebaseMessaging.getToken();
      if (token != null) {
        debugPrint('FCM Token: $token');
        await _registerToken(token);
      }
    } catch (e) {
      debugPrint('Error fetching token: $e');
    }

    // 4. Handle Token Refresh
    _firebaseMessaging.onTokenRefresh.listen(_registerToken);

    // 5. Handle Foreground Messages - Optional: Allow in-app deep link on tap if implemented as a customized toast
    // For now, simpler behavior: receiving a message in foreground does NOT auto-navigate.
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      debugPrint('Got a message whilst in the foreground!');
      debugPrint('Message data: ${message.data}');
      if (message.notification != null) {
         debugPrint('Title: ${message.notification?.title}');
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
      handleMessage(initialMessage, isInitial: true);
    }

    // Also handle any interaction when the app is in the background via a Stream listener
    FirebaseMessaging.onMessageOpenedApp.listen((msg) => handleMessage(msg, isInitial: false));
  }

  void handleMessage(RemoteMessage message, {bool isInitial = false}) async {
    // 1. Dedup using messageId
    if (message.messageId != null) {
      if (_processedMessageIds.contains(message.messageId)) {
         debugPrint('Duplicate message ignored: ${message.messageId}');
         return;
      }
      _processedMessageIds.add(message.messageId!);
    }

    // 2. Validate Payload
    final type = message.data['type'];
    final bookingId = message.data['bookingId'];

    if (bookingId == null || type == null) {
       debugPrint('Ignored push: Missing bookingId or type. Data: ${message.data}');
       return;
    }

    debugPrint('Deep Link Handled | Type: $type | ID: $bookingId | Initial: $isInitial');

    if (type == 'BOOKING_CREATED' ||
        type == 'BOOKING_ACCEPTED' ||
        type == 'BOOKING_COMPLETED' || 
        type == 'BOOKING_REJECTED') {
          
        // 3. Safe Navigation (wait for Navigator if cold start)
        if (isInitial) {
            // Wait loop to ensure MyApp is mounted and navigatorKey is attached
            int retries = 0;
            while (navigatorKey.currentState == null && retries < 10) {
                 await Future.delayed(const Duration(milliseconds: 500));
                 retries++;
            }
        }
        
        navigatorKey.currentState?.pushNamed(
            '/booking_detail',
            arguments: bookingId,
        );
    }
  }
}
