import 'package:dio/dio.dart';
import 'package:dotech_customer/core/error/failures.dart';
import 'package:dotech_customer/features/auth/data/models/user_model.dart';
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
      // The verification returns { accessToken: '...' }.
      if (response.statusCode == 201 || response.statusCode == 200) {
        final accessToken = response.data['accessToken'] ?? response.data['access_token'];
        if (accessToken != null) {
          await storage.write(key: 'accessToken', value: accessToken);
        }
        // Normally, response.data would contain the user or token.
        // Assuming the NestJS backend might need adjustment or we mock the User here for now
        // based on the token payload if needed.
        return UserModel(
          id: 'temp-id', // Placeholder or extract from JWT payload
          phone: phone,
          role: 'customer',
          isVerified: true,
        );
      }
      throw const ServerFailure(message: 'Verification failed');
    } catch (e) {
      throw const ServerFailure(message: 'Invalid OTP');
    }
  }
}
