import 'package:dio/dio.dart';
import 'package:dotech_provider/core/error/failures.dart';
import '../models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<String> sendOtp(String phone);
  Future<UserModel> verifyOtp(String phone, String otp);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final Dio dio;

  AuthRemoteDataSourceImpl({required this.dio});

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
        // Mocking for now as verification returns accessToken.
        // In real app, we extract user or fetch profile.
        return UserModel(
          id: 'provider-temp-id',
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
