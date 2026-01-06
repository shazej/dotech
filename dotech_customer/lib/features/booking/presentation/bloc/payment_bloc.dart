import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dio/dio.dart';
import '../../../../injection_container/injection_container.dart';

abstract class PaymentEvent extends Equatable {
  const PaymentEvent();
  @override
  List<Object?> get props => [];
}

class CreatePaymentIntentEvent extends PaymentEvent {
  final double amount;
  final String currency;

  const CreatePaymentIntentEvent({
    required this.amount,
    required this.currency,
  });

  @override
  List<Object?> get props => [amount, currency];
}

class ConfirmPaymentEvent extends PaymentEvent {
  final String clientSecret;
  const ConfirmPaymentEvent(this.clientSecret);
  @override
  List<Object?> get props => [clientSecret];
}

abstract class PaymentState extends Equatable {
  const PaymentState();
  @override
  List<Object?> get props => [];
}

class PaymentInitial extends PaymentState {}

class PaymentLoading extends PaymentState {}

class PaymentIntentCreated extends PaymentState {
  final String clientSecret;
  const PaymentIntentCreated(this.clientSecret);
  @override
  List<Object?> get props => [clientSecret];
}

class PaymentSuccess extends PaymentState {}

class PaymentFailure extends PaymentState {
  final String message;
  const PaymentFailure(this.message);
  @override
  List<Object?> get props => [message];
}

class PaymentBloc extends Bloc<PaymentEvent, PaymentState> {
  final Dio dio = sl<Dio>();

  PaymentBloc() : super(PaymentInitial()) {
    on<CreatePaymentIntentEvent>((event, emit) async {
      emit(PaymentLoading());
      try {
        final response = await dio.post(
          '/payments/create-intent',
          data: {'amount': event.amount, 'currency': event.currency},
        );
        emit(PaymentIntentCreated(response.data['clientSecret']));
      } catch (e) {
        emit(const PaymentFailure('Failed to initialize payment'));
      }
    });

    on<ConfirmPaymentEvent>((event, emit) async {
      emit(PaymentLoading());
      try {
        // Mock Stripe Confirmation
        await Future.delayed(const Duration(seconds: 2));
        emit(PaymentSuccess());
      } catch (e) {
        emit(const PaymentFailure('Payment failed'));
      }
    });
  }
}
