import 'package:dio/dio.dart';
import 'package:dotech_customer/core/error/failures.dart';
import '../models/booking_model.dart';

abstract class BookingRemoteDataSource {
  Future<BookingModel> createBooking({
    required String serviceId,
    required DateTime scheduledAt,
    required String addressId,
  });
  Future<List<BookingModel>> getMyBookings();
}

class BookingRemoteDataSourceImpl implements BookingRemoteDataSource {
  final Dio dio;

  BookingRemoteDataSourceImpl({required this.dio});

  @override
  Future<BookingModel> createBooking({
    required String serviceId,
    required DateTime scheduledAt,
    required String addressId,
  }) async {
    try {
      final response = await dio.post(
        '/bookings',
        data: {
          'serviceId': serviceId,
          'scheduledAt': scheduledAt.toIso8601String(),
          'addressId': addressId,
        },
      );
      return BookingModel.fromJson(response.data);
    } catch (e) {
      throw const ServerFailure(message: 'Failed to create booking');
    }
  }

  @override
  Future<List<BookingModel>> getMyBookings() async {
    try {
      final response = await dio.get('/bookings');
      return (response.data as List)
          .map((json) => BookingModel.fromJson(json))
          .toList();
    } catch (e) {
      throw const ServerFailure(message: 'Failed to fetch bookings');
    }
  }
}
