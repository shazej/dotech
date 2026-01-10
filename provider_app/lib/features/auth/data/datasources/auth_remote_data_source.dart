import 'package:dio/dio.dart';
import 'package:dotech_provider/core/error/failures.dart';
import '../models/user_model.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

abstract class AuthRemoteDataSource {
  Future<String> sendOtp(String phone);
  Future<UserModel> verifyOtp(String phone, String otp);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final Dio dio;
  final FlutterSecureStorage storage;

  AuthRemoteDataSourceImpl({required this.dio, required this.storage});

  @override
  Future<String> sendOtp(String phone) async {
    try {
      final response = await dio.post('/auth/otp/send', data: {'phone': phone});
      return response.data['message'];
    } catch (e) {
      throw const ServerFailure(message: 'Failed to send OTP');
    }
  }

  @override
  Future<UserModel> verifyOtp(String phone, String otp) async {
    try {
      final response = await dio.post(
        '/auth/otp/verify',
        data: {'phone': phone, 'otp': otp},
      );
      if (response.statusCode == 201 || response.statusCode == 200) {
        final accessToken = response.data['accessToken'] ?? response.data['access_token'];
        if (accessToken != null) {
          await storage.write(key: 'accessToken', value: accessToken);
        }
        // Parse user from response
        final userData = response.data['user'];
        if (userData != null) {
          return UserModel.fromJson(userData);
        }

        return UserModel(
          id: 'extracted-from-token',
          phone: phone,
          role: 'provider',
          isVerified: true,
        );
      }
      throw const ServerFailure(message: 'Verification failed');
    } catch (e) {
      throw const ServerFailure(message: 'Invalid OTP');
    }
  }
}
