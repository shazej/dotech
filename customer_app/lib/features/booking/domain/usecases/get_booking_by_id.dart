import 'package:dartz/dartz.dart';
import 'package:dotech_customer/core/error/failures.dart';
import 'package:dotech_customer/features/booking/domain/entities/booking.dart';
import 'package:dotech_customer/features/booking/domain/repositories/booking_repository.dart';

class GetBookingById {
  final BookingRepository repository;

  GetBookingById(this.repository);

  Future<Either<Failure, Booking>> call(String id) async {
    return await repository.getBookingById(id);
  }
}
