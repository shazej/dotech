import 'package:dartz/dartz.dart';
import 'package:dotech_customer/core/error/failures.dart';
import 'package:dotech_customer/features/booking/domain/entities/booking.dart';
import 'package:dotech_customer/features/booking/domain/repositories/booking_repository.dart';
import '../datasources/booking_remote_data_source.dart';

class BookingRepositoryImpl implements BookingRepository {
  final BookingRemoteDataSource remoteDataSource;

  BookingRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, Booking>> createBooking({
    required String serviceId,
    required DateTime scheduledAt,
    required String addressId,
  }) async {
    try {
      final booking = await remoteDataSource.createBooking(
        serviceId: serviceId,
        scheduledAt: scheduledAt,
        addressId: addressId,
      );
      return Right(booking);
    } catch (e) {
      if (e is Failure) return Left(e);
      return const Left(ServerFailure(message: 'Booking Server Error'));
    }
  }

  @override
  Future<Either<Failure, List<Booking>>> getMyBookings() async {
    try {
      final bookings = await remoteDataSource.getMyBookings();
      return Right(bookings);
    } catch (e) {
      if (e is Failure) return Left(e);
      return const Left(ServerFailure(message: 'Booking Retrieval Error'));
    }
  }

  @override
  Future<Either<Failure, Booking>> getBookingById(String id) async {
    try {
      final booking = await remoteDataSource.getBookingById(id);
      return Right(booking);
    } catch (e) {
       if (e is Failure) return Left(e);
       return const Left(ServerFailure(message: 'Booking Details Error'));
    }
  }
}
