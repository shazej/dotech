import 'package:dartz/dartz.dart';
import 'package:dotech_customer/core/error/failures.dart';
import '../entities/booking.dart';

abstract class BookingRepository {
  Future<Either<Failure, Booking>> createBooking({
    required String serviceId,
    required DateTime scheduledAt,
    required String addressId,
  });
  Future<Either<Failure, List<Booking>>> getMyBookings();
}
